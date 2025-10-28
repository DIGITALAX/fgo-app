import { useState, useRef } from "react";
import { MetadataFormProps } from "../types";
import Image from "next/image";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const MetadataForm = ({
  formData,
  onInputChange,
  onFileChange,
  onTagsChange,
  onLorasChange,
  onCustomFieldsChange,
  loading = false,
  existingImageUrl,
  existingAttachments = [],
  dict,
}: MetadataFormProps) => {
  const [currentTag, setCurrentTag] = useState<string>("");
  const [currentLora, setCurrentLora] = useState<string>("");
  const [newFieldKey, setNewFieldKey] = useState<string>("");
  const [newFieldValue, setNewFieldValue] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        onTagsChange([...formData.tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(formData.tags.filter((tag) => tag !== tagToRemove));
  };

  const handleLoraKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentLora.trim()) {
      e.preventDefault();
      if (!formData.loras.includes(currentLora.trim())) {
        onLorasChange([...formData.loras, currentLora.trim()]);
      }
      setCurrentLora("");
    }
  };

  const removeLora = (loraToRemove: string) => {
    onLorasChange(formData.loras.filter((lora) => lora !== loraToRemove));
  };

  const handleAddCustomField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      const updatedFields = {
        ...(formData.customFields || {}),
        [newFieldKey.trim()]: newFieldValue.trim(),
      };
      onCustomFieldsChange(updatedFields);
      setNewFieldKey("");
      setNewFieldValue("");
    }
  };

  const handleRemoveCustomField = (key: string) => {
    const updatedFields = { ...(formData.customFields || {}) };
    delete updatedFields[key];
    onCustomFieldsChange(updatedFields);
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
        updatedAttachments.forEach((file) => dt.items.add(file));
        onFileChange("attachments", dt.files);
      }
    }

    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = formData.attachments.filter(
      (_, i) => i !== index
    );
    onFileChange("attachments", null);
    setTimeout(() => {
      const dt = new DataTransfer();
      updatedAttachments.forEach((file) => dt.items.add(file));
      const fileInput = document.querySelector(
        'input[type="file"][multiple]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.files = dt.files;
      onFileChange("attachments", dt.files);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.title} *
          </label>
          <FancyBorder color="white" type="circle" className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
              disabled={loading}
              required
            />
          </FancyBorder>
        </div>

        <div>
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.aiModel}
          </label>
          <FancyBorder color="white" type="circle" className="relative">
            <input
              type="text"
              name="aiModel"
              value={formData.aiModel}
              onChange={onInputChange}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
              placeholder={dict?.aiModelPlaceholder}
              disabled={loading}
            />
          </FancyBorder>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.description} *
          </label>
          <FancyBorder type="diamond" color="oro" className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              rows={3}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none resize-none"
              disabled={loading}
              required
            />
          </FancyBorder>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.prompt}
          </label>
          <FancyBorder type="diamond" color="oro" className="relative">
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={onInputChange}
              rows={3}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none resize-none"
              placeholder={dict?.promptPlaceholder}
              disabled={loading}
            />
          </FancyBorder>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.workflow}
          </label>
          <FancyBorder type="diamond" color="oro" className="relative">
            <textarea
              name="workflow"
              value={formData.workflow}
              onChange={onInputChange}
              rows={4}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none resize-none"
              placeholder={dict?.workflowPlaceholder}
              disabled={loading}
            />
          </FancyBorder>
        </div>

        <div>
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.mainImage} {!existingImageUrl && "*"}
          </label>
          {existingImageUrl && !formData.image && (
            <FancyBorder type="diamond" color="oro" className="relative mb-3">
              <div className="relative z-10 p-3 flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    draggable={false}
                    layout="fill"
                    src={existingImageUrl}
                    alt="Current image"
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <p className="text-gris font-chicago">{dict?.currentImage}</p>
                  <p className="text-gris font-chicago text-xs">
                    {dict?.uploadNewImageReplace}
                  </p>
                </div>
              </div>
            </FancyBorder>
          )}
          <div
            onClick={() => imageInputRef.current?.click()}
            className="relative cursor-pointer hover:opacity-80 transition-opacity w-fit"
          >
            <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderoro2.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">{dict?.selectImage}</span>
            </div>
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange("image", e.target.files)}
            className="hidden"
            disabled={loading}
            required={!existingImageUrl}
          />
          {formData.image && (
            <div className="mt-2 text-xs text-gris font-chicago">
              {dict?.newImageSelected}: {formData.image.name}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-chicago text-gris">
              {dict?.additionalFiles}
            </label>
            <span className="text-xs text-gris font-chicago">
              {formData.attachments.length + existingAttachments.length}/3 files
            </span>
          </div>

          {existingAttachments.length > 0 && (
            <FancyBorder type="diamond" color="oro" className="relative mb-3">
              <div className="relative z-10 p-3">
                <p className="text-sm text-gris font-chicago mb-2">
                  {dict?.currentAttachments}:
                </p>
                <div className="space-y-1">
                  {existingAttachments.map(
                    (
                      attachment: { uri?: string; type?: string },
                      index: number
                    ) => (
                      <div
                        key={`existing-${index}`}
                        className="flex items-center justify-between text-xs text-gris font-chicago p-2"
                      >
                        <span>{attachment.type} (existing)</span>
                        <span className="text-gris">
                          {dict?.willBeKeptUnlessReplaced}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </FancyBorder>
          )}

          <div
            onClick={() =>
              !loading &&
              formData.attachments.length + existingAttachments.length < 3 &&
              attachmentInputRef.current?.click()
            }
            className={`relative cursor-pointer hover:opacity-80 transition-opacity w-fit ${
              formData.attachments.length + existingAttachments.length >= 3
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
              <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/borderoro2.png"}
                  draggable={false}
                  objectFit="fill"
                  fill
                  alt="border"
                />
              </div>
              <span className="relative z-10">{dict?.selectFiles}</span>
            </div>
          </div>
          <input
            ref={attachmentInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleAttachmentChange}
            className="hidden"
            disabled={
              loading ||
              formData.attachments.length + existingAttachments.length >= 3
            }
          />
          {formData.attachments.length + existingAttachments.length >= 3 && (
            <p className="mt-1 text-xs text-white font-chicago">
              {dict?.maximumFilesReached}
            </p>
          )}
          {formData.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gris font-chicago mb-1">
                {dict?.newFiles}:
              </p>
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs text-gris font-chicago p-2"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-fresa hover:text-oro ml-2"
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
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.tags}
          </label>
          <FancyBorder color="white" type="circle" className="relative">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyPress}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
              placeholder={dict?.typeEnterAddTags}
              disabled={loading}
            />
          </FancyBorder>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <div key={tag} className="relative">
                  <div className="text-xs text-oro font-chicago relative lowercase flex items-center gap-1 px-3 py-1 bg-offNegro">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="relative z-10 text-oro hover:text-gris"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.loras}
          </label>
          <FancyBorder color="white" type="circle" className="relative">
            <input
              type="text"
              value={currentLora}
              onChange={(e) => setCurrentLora(e.target.value)}
              onKeyDown={handleLoraKeyPress}
              className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
              placeholder={dict?.typeEnterAddLoras}
              disabled={loading}
            />
          </FancyBorder>
          {formData.loras.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.loras.map((lora) => (
                <div key={lora} className="relative">
                  <div className="text-xs text-verde font-chicago relative lowercase flex items-center gap-1 px-3 py-1 bg-offNegro">
                    <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                      <Image
                        src={"/images/borderoro2.png"}
                        draggable={false}
                        objectFit="fill"
                        fill
                        alt="border"
                      />
                    </div>
                    <span className="relative z-10">{lora}</span>
                    <button
                      type="button"
                      onClick={() => removeLora(lora)}
                      className="relative z-10 text-verde hover:text-gris"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-chicago text-gris mb-2">
            {dict?.customFields}
          </label>
          <div className="space-y-3">
            <div className="flex gap-2">
              <FancyBorder
                color="white"
                type="circle"
                className="relative flex-1"
              >
                <input
                  type="text"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                  placeholder={dict?.fieldNamePlaceholder}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                  disabled={loading}
                />
              </FancyBorder>
              <FancyBorder
                color="white"
                type="circle"
                className="relative flex-1"
              >
                <input
                  type="text"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  placeholder={dict?.fieldValuePlaceholder}
                  className="relative z-10 w-full px-3 py-2 text-gris font-chicago text-sm focus:outline-none"
                  disabled={loading}
                />
              </FancyBorder>
              <div
                onClick={handleAddCustomField}
                className={`relative cursor-pointer hover:opacity-80 transition-opacity ${
                  loading || !newFieldKey.trim() || !newFieldValue.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="text-xs text-gris font-chicago relative lowercase flex px-4 py-2 bg-offNegro">
                  <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                    <Image
                      src={"/images/borderoro2.png"}
                      draggable={false}
                      objectFit="fill"
                      fill
                      alt="border"
                    />
                  </div>
                  <span className="relative z-10">{dict?.add}</span>
                </div>
              </div>
            </div>

            {Object.keys(formData.customFields || {}).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gris font-chicago">
                  {dict?.customFields}:
                </p>
                {Object.entries(formData.customFields || {}).map(
                  ([key, value]) => (
                    <div key={key} className="relative">
                      <div className="absolute z-0 top-0 left-0 w-full h-full flex">
                        <Image
                          src={"/images/borderpurple.png"}
                          draggable={false}
                          objectFit="fill"
                          fill
                          alt="border"
                        />
                      </div>
                      <div className="relative z-10 p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-chicago text-oro">
                            {key}:
                          </span>
                          <span className="text-sm text-gris font-chicago ml-2">
                            {value}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomField(key)}
                          className="text-fresa hover:text-oro ml-2"
                          disabled={loading}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
