import { useContext, useState, useRef } from "react";
import Button from "./Button";
import { GlobalContext } from "../contexts/Global";
import { STATUS, sleep } from "../utils";

export default function ContextSettings({
  context,
  setContext,
  callback,
  parentContext,
}) {
  const { orbisdb, settings, setSettings, slot, sessionJwt } = useContext(
    GlobalContext
  ) as any;
  const [status, setStatus] = useState(STATUS.ACTIVE);
  const [contextName, setContextName] = useState(
    context?.name ? context.name : ""
  );
  const [contextLogoImg, setContextLogoImg] = useState(
    context?.logo ? context.logo : null
  );
  const [contextDescription, setContextDescription] = useState(
    context?.description ? context.description : ""
  );

  /** Will update the context stream on Ceramic and save it locally */
  const uploadToServer = async () => {
    try {
      setStatus(STATUS.LOADING);

      // Validate required fields
      if (!contextName || contextName.trim() === "") {
        alert("Context name is required");
        setStatus(STATUS.ERROR);
        return;
      }

      /** Update Ceramic stream */
      let content = { ...(context || {}) };
      console.log("Previous context:", content);
      content.name = contextName;
      content.description = contextDescription ? contextDescription : "";
      console.log("New context:", content);
      if (parentContext) {
        content.context = parentContext;
      }
      let res;

      /** Update if existing or create new context */
      if (context && context.stream_id) {
        delete content.stream_id;
        delete content.contexts;

        try {
          res = await orbisdb.update(context.stream_id).replace(content).run();
        } catch (error) {
          console.error("Error updating context:", error);
          setStatus(STATUS.ERROR);
          alert("Error updating context. Please try again.");
          return;
        }
      } else {
        try {
          res = await orbisdb
            .insert(
              "kjzl6hvfrbw6c6lqihb9i25vyr4hob667w8otxyzw7fohetbaqkjqrgjvll1h4b"
            )
            .value(content)
            .run();
        } catch (error) {
          console.error("Error creating context:", error);
          setStatus(STATUS.ERROR);
          alert("Error creating context. Please try again.");
          return;
        }
      }

      if (!res || !res.id) {
        console.error("Invalid response from orbisdb:", res);
        setStatus(STATUS.ERROR);
        alert("There was an error with the database operation.");
        return;
      }

      console.log("res:", res);
      content.stream_id = res.id;
      console.log("Updated content:", content);

      /** If successful update in local settings */
      try {
        // Update settings to add new context
        const response = await fetch("/api/contexts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionJwt}`,
          },
          body: JSON.stringify({
            context: JSON.stringify(content),
          }),
        });

        const data = await response.json();
        console.log("data:", data);

        if (response.status == 200) {
          /** Update context state */
          if (setContext) {
            setContext(data.context);
          }

          setSettings(data.settings);
          setStatus(STATUS.SUCCESS);
          await sleep(500);

          /** Run callback if available (can be used to hide modal) */
          if (callback) {
            callback(content);
          }
        } else {
          setStatus(STATUS.ERROR);
          alert("Error saving context to settings.");
        }
      } catch (error) {
        console.error("Error saving context to settings:", error);
        setStatus(STATUS.ERROR);
        alert("Error saving context to settings. Please try again.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setStatus(STATUS.ERROR);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Context name"
        className="bg-white w-full mt-2 px-2 py-1 rounded-md border border-slate-300 text-base text-slate-900 mb-1.5"
        onChange={(e) => setContextName(e.target.value)}
        value={contextName}
      />
      <textarea
        placeholder="Context description"
        rows={2}
        className="bg-white w-full px-2 py-1 rounded-md border border-slate-300 text-base text-slate-900 mb-2"
        onChange={(e) => setContextDescription(e.target.value)}
        value={contextDescription}
      />

      {/** CTA to save updated context */}
      <div className="flex w-full justify-center mt-2">
        <Button
          title="Save"
          successTitle="Saved"
          status={status}
          onClick={() => uploadToServer()}
        />
      </div>
    </div>
  );
}
