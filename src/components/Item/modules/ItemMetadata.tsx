import { useItemMetadata } from "../hooks/useItemMetadata";
import { ItemMetadataProps } from "../types";

export const ItemMetadata = ({ item, dict }: ItemMetadataProps) => {
  const { attachmentUrls } = useItemMetadata(item);

  if (!item.metadata) {
    return null;
  }

  return (
    <>
      {item.metadata.description && (
        <div className="border border-white rounded-sm p-6">
          <h3 className="text-lg font-herm text-white mb-3">{dict?.description}</h3>
          <p className="text-white leading-relaxed">{item.metadata.description}</p>
        </div>
      )}

      <div className="border border-white rounded-sm p-6">
        <h3 className="text-lg font-herm text-white mb-4">{dict?.aiGenerationDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {item.metadata.prompt && (
            <div>
              <h4 className="text-ama font-herm mb-2">{dict?.prompt}</h4>
              <p className="text-white text-sm bg-black/20 p-3 rounded-sm border border-white/20">
                {item.metadata.prompt}
              </p>
            </div>
          )}
          
          {item.metadata.aiModel && (
            <div>
              <h4 className="text-ama font-herm mb-2">{dict?.aiModel}</h4>
              <p className="text-white text-sm">{item.metadata.aiModel}</p>
            </div>
          )}
          
          {item.metadata.workflow && (
            <div>
              <h4 className="text-ama font-herm mb-2">{dict?.workflow}</h4>
              <p className="text-white text-sm">{item.metadata.workflow}</p>
            </div>
          )}
          
          {item.metadata.version && (
            <div>
              <h4 className="text-ama font-herm mb-2">{dict?.version}</h4>
              <p className="text-white text-sm">{item.metadata.version}</p>
            </div>
          )}
          
          {item.metadata.loras && item.metadata.loras.length > 0 && (
            <div>
              <h4 className="text-ama font-herm mb-2">{dict?.loras}</h4>
              <div className="space-y-1">
                {item.metadata.loras.map((lora: string, index: number) => (
                  <span key={index} className="inline-block bg-ama/20 text-ama px-2 py-1 rounded-sm text-xs mr-1 mb-1 border border-ama/30">
                    {lora}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {item.metadata.tags && item.metadata.tags.length > 0 && (
            <div>
              <h4 className="text-ama font-herm mb-2">{dict?.tags}</h4>
              <div className="space-y-1">
                {item.metadata.tags.map((tag: string, index: number) => (
                  <span key={index} className="inline-block bg-ama/20 text-ama px-2 py-1 rounded-sm text-xs mr-1 mb-1 border border-ama/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {item.metadata.customFields && Object.keys(item.metadata.customFields).length > 0 && (
        <div className="border border-white rounded-sm p-6">
          <h3 className="text-lg font-herm text-white mb-4">{dict?.customFields}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(item.metadata.customFields).map(([key, value]) => (
              <div key={key}>
                <h4 className="text-ama font-herm mb-2">{key}</h4>
                <p className="text-white text-sm bg-black/20 p-3 rounded-sm border border-white/20 break-all">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.uri && (
        <div className="border border-white rounded-sm p-6">
          <h3 className="text-lg font-herm text-white mb-4">{dict?.ipfsMetadataUri}</h3>
          <div className="bg-black/20 border border-white/30 rounded-sm p-4">
            <p className="text-white text-sm font-mono break-all">
              {item.uri}
            </p>
          </div>
        </div>
      )}

      {item.metadata.attachments && item.metadata.attachments.length > 0 && (
        <div className="border border-white rounded-sm p-6">
          <h3 className="text-lg font-herm text-white mb-4">{dict?.attachments}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {item.metadata.attachments.map((attachment, index: number) => (
              <div key={index} className="bg-black/20 border border-white/30 rounded-sm p-4">
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-ama">{dict?.type}:</span>
                    <span className="text-white">{attachment.type}</span>
                  </div>
                  {attachment.uri && (
                    <a
                      href={attachmentUrls[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ama hover:text-ama/80 text-xs underline font-herm"
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};