import { CheckCircle2, Clock, Truck, Package, PackageCheck } from "lucide-react";

const OrderTimeline = ({ status }) => {
  const steps = [
    { 
      id: 'processing', 
      label: 'Order Processing', 
      icon: <Clock className="w-5 h-5" />, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50',
      description: 'We are preparing your package for shipment.' 
    },
    { 
      id: 'shipped', 
      label: 'Shipped', 
      icon: <Truck className="w-5 h-5" />, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-50',
      description: 'Your order is on its way to you.' 
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      icon: <PackageCheck className="w-5 h-5" />, 
      color: 'text-green-500', 
      bgColor: 'bg-green-50',
      description: 'Order successfully delivered to your address.' 
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);
  const activeStepIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gray-100 -z-10" />
        <div 
          className="absolute left-6 top-0 w-0.5 bg-green-500 transition-all duration-1000 ease-in-out -z-10" 
          style={{ height: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
        />

        <div className="space-y-8">
          {steps.map((step, index) => {
            const isCompleted = index <= activeStepIndex;
            const isCurrent = index === activeStepIndex;

            return (
              <div key={step.id} className="flex items-start gap-6 group">
                {/* Icon Circle */}
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500
                  ${isCompleted ? 'bg-green-500 text-white shadow-green-100 ring-4 ring-green-50' : 'bg-white text-gray-400 ring-1 ring-gray-100'}
                  ${isCurrent ? 'animate-pulse scale-110' : ''}
                `}>
                  {isCompleted && index < activeStepIndex ? <CheckCircle2 className="w-6 h-6" /> : step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4 className={`font-bold text-lg mb-1 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm leading-relaxed ${isCompleted ? 'text-gray-600' : 'text-gray-400 opacity-60'}`}>
                    {step.description}
                  </p>
                  {isCurrent && (
                    <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full animate-bounce">
                      Current Status
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
