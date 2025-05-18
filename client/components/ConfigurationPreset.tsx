import React from "react";
import Button from "./Button";
import { GovernanceIcon, SocialIcon } from "./Icons";

// Define a type for the preset values
type PresetType = "social" | "governance";

interface ConfigurationPresetProps {
  presets: PresetType[];
  setPresets: React.Dispatch<React.SetStateAction<PresetType[]>>;
  status?: number;
  onNextClick?: () => void; // More descriptive prop name
}

const ConfigurationPreset: React.FC<ConfigurationPresetProps> = ({
  presets,
  setPresets,
  status,
  onNextClick,
}) => {
  function enablePreset(type: PresetType, enabled: boolean) {
    if (enabled) {
      setPresets((prevPresets) =>
        prevPresets.includes(type) ? prevPresets : [...prevPresets, type],
      );
    } else {
      setPresets((prevPresets) => prevPresets.filter((p) => p !== type));
    }
  }

  return (
    <>
      <div className="mt-2">
        <label className="text-base font-medium text-center">
          Enable some presets:
        </label>
        <p className="text-sm text-slate-500 mb-2">
          Click on the presets you want to use...
        </p>
        <div className="flex flex-row items-center space-x-2 mb-3">
          {/** Social preset */}
          <button
            aria-label="Enable Social preset"
            className={`preset-button ${
              presets.includes("social") ? "preset-button-active" : ""
            }`}
            onClick={() => enablePreset("social", !presets.includes("social"))}
          >
            <SocialIcon />
            <span className="mt-1">Social</span>
          </button>
          {/** Governance preset */}
          <button
            aria-label="Enable Governance preset"
            className={`preset-button ${
              presets.includes("governance") ? "preset-button-active" : ""
            }`}
            onClick={() =>
              enablePreset("governance", !presets.includes("governance"))
            }
          >
            <GovernanceIcon />
            <span className="mt-1">Governance</span>
          </button>
        </div>
      </div>

      {onNextClick && (
        <div className="flex w-full justify-center">
          <Button
            title="Next"
            status={status}
            onClick={onNextClick}
            successTitle="Success"
          />
        </div>
      )}
    </>
  );
};

export default ConfigurationPreset;
