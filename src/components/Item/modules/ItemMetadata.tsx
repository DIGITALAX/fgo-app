import { useItemMetadata } from "../hooks/useItemMetadata";
import { ItemMetadataProps } from "../types";
import { FancyBorder } from "@/components/Layout/modules/FancyBorder";

export const ItemMetadata = ({ item, dict }: ItemMetadataProps) => {
  const { attachmentUrls } = useItemMetadata(item);

  if (!item.metadata) {
    return null;
  }

  return (
    <div className="relative w-full flex flex-col gap-2">
      {item.metadata.description && (
        <FancyBorder
          type="diamond"
          color="oro"
          className="bg-black p-6 space-y-2"
        >
          <h3 className="text-lg font-agency uppercase text-white mb-3">
            {dict?.description}: {item.metadata.description}
          </h3>
        </FancyBorder>
      )}

      <FancyBorder
        type="diamond"
        color="oro"
        className="bg-black p-6 space-y-4"
      >
        <h3 className="text-lg font-agency uppercase text-white mb-4">
          {dict?.aiGenerationDetails}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {item.metadata.prompt && (
            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.prompt}</span>
              <p className="text-white font-slim text-sm">
                {item.metadata.prompt}
              </p>
            </div>
          )}

          {item.metadata.aiModel && (
            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.aiModel}</span>
              <p className="text-white font-slim text-sm">
                {item.metadata.aiModel}
              </p>
            </div>
          )}

          {item.metadata.workflow && (
            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.workflow}</span>
              <p className="text-white font-slim text-sm">
                {item.metadata.workflow}
              </p>
            </div>
          )}

          {item.metadata.version && (
            <div className="space-y-2">
              <span className="text-oro font-agency">{dict?.version}</span>
              <p className="text-white font-slim text-sm">
                {item.metadata.version}
              </p>
            </div>
          )}

          {item.metadata.loras && item.metadata.loras.length > 0 && (
            <div className="space-y-3">
              <span className="text-oro font-agency">{dict?.loras}</span>
              <div className="flex flex-wrap gap-1">
                {item.metadata.loras.map((lora: string, index: number) => (
                  <span
                    key={index}
                    className="bg-oro/10 text-oro px-2 py-1 text-xs font-slim"
                  >
                    {lora}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.metadata.tags && item.metadata.tags.length > 0 && (
            <div className="space-y-3">
              <span className="text-oro font-agency">{dict?.tags}</span>
              <div className="flex flex-wrap gap-1">
                {item.metadata.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-oro/10 text-oro px-2 py-1 text-xs font-slim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </FancyBorder>

      {item.metadata.customFields &&
        Object.keys(item.metadata.customFields).length > 0 && (
          <FancyBorder
            type="diamond"
            color="oro"
            className="bg-black p-6 space-y-4"
          >
            <h3 className="text-lg font-agency uppercase text-white mb-4">
              {dict?.customFields}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(item.metadata.customFields).map(
                ([key, value]) => (
                  <div key={key} className="space-y-2">
                    <span className="text-oro font-agency">{key}</span>
                    <p className="text-white font-slim text-sm break-all">
                      {String(value)}
                    </p>
                  </div>
                )
              )}
            </div>
          </FancyBorder>
        )}

      {item.uri && (
        <FancyBorder
          type="diamond"
          color="oro"
          className="bg-black p-6 space-y-4"
        >
          <h3 className="text-lg font-agency uppercase text-white mb-4">
            {dict?.ipfsMetadataUri}
          </h3>
          <p className="text-white font-slim text-xs break-all">{item.uri}</p>
        </FancyBorder>
      )}

      {item.metadata.attachments && item.metadata.attachments.length > 0 && (
        <FancyBorder
          type="diamond"
          color="oro"
          className="bg-black p-6 space-y-4"
        >
          <h3 className="text-lg font-agency uppercase text-white mb-4">
            {dict?.attachments}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {item.metadata.attachments.map((attachment, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex gap-2 items-center justify-start text-center flex-row">
                  <span className="text-oro flex font-agency text-sm">
                    {dict?.type}:
                  </span>
                  <span className="text-white flex font-awk text-base uppercase">
                    {attachment.type}
                  </span>
                </div>
                {attachment.uri && (
                  <a
                    href={attachmentUrls[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-oro hover:text-oro/80 text-base uppercase font-awk underline"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            ))}
          </div>
        </FancyBorder>
      )}
    </div>
  );
};
