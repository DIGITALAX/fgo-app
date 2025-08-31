import { useState } from "react";
import { MetadataFormProps } from "../types";

export const MetadataForm = ({ 
  formData, 
  onInputChange, 
  onFileChange, 
  onTagsChange, 
  onLorasChange, 
  loading = false,
  existingImageUrl,
  existingAttachments = []
}: MetadataFormProps) => {
  const [currentTag, setCurrentTag] = useState("");
  const [currentLora, setCurrentLora] = useState("");

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        onTagsChange([...formData.tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleLoraKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentLora.trim()) {
      e.preventDefault();
      if (!formData.loras.includes(currentLora.trim())) {
        onLorasChange([...formData.loras, currentLora.trim()]);
      }
      setCurrentLora("");
    }
  };

  const removeLora = (loraToRemove: string) => {
    onLorasChange(formData.loras.filter(lora => lora !== loraToRemove));
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const currentAttachments = formData.attachments || [];
      const availableSlots = 3 - currentAttachments.length;
      const filesToAdd = newFiles.slice(0, availableSlots);
      
      if (filesToAdd.length > 0) {
        const updatedAttachments = [...currentAttachments, ...filesToAdd];
        const dt = new DataTransfer();
        updatedAttachments.forEach(file => dt.items.add(file));
        onFileChange('attachments', dt.files);
      }
    }
    
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = formData.attachments.filter((_, i) => i !== index);
    onFileChange('attachments', null);
    setTimeout(() => {
      const dt = new DataTransfer();
      updatedAttachments.forEach(file => dt.items.add(file));
      const fileInput = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
      if (fileInput) fileInput.files = dt.files;
      onFileChange('attachments', dt.files);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            AI Model
          </label>
          <input
            type="text"
            name="aiModel"
            value={formData.aiModel}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent"
            placeholder="e.g., SDXL, Midjourney"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent resize-none"
            disabled={loading}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Prompt
          </label>
          <textarea
            name="prompt"
            value={formData.prompt}
            onChange={onInputChange}
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent resize-none"
            placeholder="Describe your AI generation prompt..."
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Workflow
          </label>
          <textarea
            name="workflow"
            value={formData.workflow}
            onChange={onInputChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent resize-none font-mono text-xs"
            placeholder="JSON workflow or text description..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Main Image {!existingImageUrl && '*'}
          </label>
          {existingImageUrl && !formData.image && (
            <div className="mb-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={existingImageUrl} 
                  alt="Current image" 
                  className="w-12 h-12 object-cover rounded border border-gray-500"
                />
                <div className="text-sm">
                  <p className="text-white">Current Image</p>
                  <p className="text-gray-400 text-xs">Upload a new image to replace</p>
                </div>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange('image', e.target.files)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-azul file:text-white file:cursor-pointer hover:file:bg-azul/80"
            disabled={loading}
            required={!existingImageUrl}
          />
          {formData.image && (
            <div className="mt-2 text-xs text-gray-400">
              New image selected: {formData.image.name}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Additional Files
            </label>
            <span className="text-xs text-gray-500">
              {(formData.attachments.length + existingAttachments.length)}/3 files
            </span>
          </div>
          
          {existingAttachments.length > 0 && (
            <div className="mb-3 p-3 bg-gray-800 border border-gray-600 rounded-lg">
              <p className="text-sm text-white mb-2">Current Attachments:</p>
              <div className="space-y-1">
                {existingAttachments.map((attachment: { uri?: string; type?: string }, index: number) => (
                  <div key={`existing-${index}`} className="flex items-center justify-between text-xs text-gray-400 bg-gray-700 p-2 rounded">
                    <span>{attachment.type || 'attachment'} (existing)</span>
                    <span className="text-gray-500">Will be kept unless replaced</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleAttachmentChange}
            className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-white file:cursor-pointer transition-colors ${
              (formData.attachments.length + existingAttachments.length) >= 3 
                ? 'file:bg-gray-600 cursor-not-allowed' 
                : 'file:bg-gray-700 hover:file:bg-gray-600'
            }`}
            disabled={loading || (formData.attachments.length + existingAttachments.length) >= 3}
          />
          {(formData.attachments.length + existingAttachments.length) >= 3 && (
            <p className="mt-1 text-xs text-orange-400">
              Maximum files reached. Remove existing or new files to add more.
            </p>
          )}
          {formData.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-white mb-1">New Files:</p>
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-xs text-gray-400 bg-gray-800 p-2 rounded">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-400 hover:text-red-300 ml-2"
                    disabled={loading}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyPress}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent"
            placeholder="Type and press Enter to add tags..."
            disabled={loading}
          />
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 bg-azul/20 text-azul text-xs rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-azul/70 hover:text-azul"
                    disabled={loading}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            LoRAs
          </label>
          <input
            type="text"
            value={currentLora}
            onChange={(e) => setCurrentLora(e.target.value)}
            onKeyDown={handleLoraKeyPress}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul focus:border-transparent"
            placeholder="Type and press Enter to add LoRAs..."
            disabled={loading}
          />
          {formData.loras.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.loras.map((lora) => (
                <span
                  key={lora}
                  className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md"
                >
                  {lora}
                  <button
                    type="button"
                    onClick={() => removeLora(lora)}
                    className="ml-1 text-purple-300/70 hover:text-purple-300"
                    disabled={loading}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};