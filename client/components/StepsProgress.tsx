export default function StepsProgress({ steps = [], currentStep = 1 }) {
  return (
    <ol className="relative flex items-center w-full text-sm font-medium text-center mt-6 mb-6 justify-center">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex items-center justify-center ${index < steps.length - 1 ? "mr-2" : ""}`}
        >
          <div className="flex flex-col items-center">
            {currentStep == index + 1 && (
              <span className="text-sm text-[#4483FD] mb-2">{step}</span>
            )}
            <div className="flex items-center">
              <span
                className={`rounded-full h-3 w-3 ${currentStep >= index + 1 ? "bg-[#4483FD]" : "bg-slate-200"}`}
              ></span>
              {index < steps.length - 1 && (
                <span
                  className={`h-1 border-b ml-2 w-16 ${currentStep > index + 1 ? "border-[#4483FD]" : "border-slate-200"}`}
                ></span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
