import { toast, ToastContainer } from 'react-toastify';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { Slide } from 'react-toastify';

const Toast = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar
    newestOnTop={true}
    closeButton={false}
    closeOnClick={false}
    pauseOnFocusLoss={false}
    draggable={false}
    toastClassName="!bg-white !rounded-xl !shadow-lg !border !border-gray-100 !max-w-md !overflow-hidden"
    bodyClassName="!p-0"
    className="!w-auto !z-[1000]"
    transition={Slide}
  />
);

// Success Toast (General Purpose)
const showSuccessToast = (message, title = "Success") => {
  toast.success(
    <div className="flex items-start gap-4 p-5 pr-10 relative group">
      <div className="p-2.5 rounded-full bg-emerald-100 border border-emerald-200 flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800">{title}</p>
          <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">Completed</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button 
        onClick={() => toast.dismiss()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    {
      icon: false,
      className: "!border-l-4 !border-emerald-500 hover:!shadow-md transition-all"
    }
  );
};

// Info Toast
const showInfoToast = (message, title = "Info") => {
  toast.info(
    <div className="flex items-start gap-4 p-5 pr-10 relative group">
      <div className="p-2.5 rounded-full bg-blue-100 border border-blue-200 flex-shrink-0">
        <Info className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800">{title}</p>
          <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">Note</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button 
        onClick={() => toast.dismiss()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    {
      icon: false,
      className: "!border-l-4 !border-blue-500 hover:!shadow-md transition-all"
    }
  );
};

// Warning Toast
const showWarningToast = (message, title = "Warning") => {
  toast.warning(
    <div className="flex items-start gap-4 p-5 pr-10 relative group bg-amber-50/50">
      <div className="p-2.5 rounded-full bg-amber-100 border border-amber-200 flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800">{title}</p>
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-600 rounded-full font-medium">Attention</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button 
        onClick={() => toast.dismiss()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    {
      icon: false,
      className: "!border-l-4 !border-amber-500 hover:!shadow-md transition-all"
    }
  );
};

// Error Toast (General Purpose)
const showErrorToast = (message, title = "Error") => {
  toast.error(
    <div className="flex items-start gap-4 p-5 pr-10 relative group bg-red-50/50">
      <div className="p-2.5 rounded-full bg-red-100 border border-red-200 flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-800">{title}</p>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">Important</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      <button 
        onClick={() => toast.dismiss()}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    {
      icon: false,
      className: "!border-l-4 !border-red-500 hover:!shadow-md transition-all"
    }
  );
};

export { Toast, showSuccessToast, showInfoToast, showWarningToast, showErrorToast };