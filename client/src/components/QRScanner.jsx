import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { checkInParticipant } from '../services/api';
import toast from 'react-hot-toast';
import { HiQrcode, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.regId) {
              await html5QrCode.stop();
              setScanning(false);

              try {
                const res = await checkInParticipant(data.regId);
                setResult({
                  success: true,
                  message: res.data.message,
                  student: res.data.registration?.student?.name,
                  event: res.data.registration?.event?.title
                });
                toast.success('Check-in successful!');
              } catch (err) {
                setResult({
                  success: false,
                  message: err.response?.data?.message || 'Check-in failed'
                });
                toast.error(err.response?.data?.message || 'Check-in failed');
              }
            }
          } catch {
            // Not a valid QR code, continue scanning
          }
        },
        () => {}
      );

      setScanning(true);
    } catch (err) {
      toast.error('Unable to access camera. Please allow camera permissions.');
      console.error(err);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {
        // Scanner already stopped
      }
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HiQrcode className="w-6 h-6 text-primary-400" />
          QR Check-in Scanner
        </h3>
        {!scanning ? (
          <button onClick={startScanner} className="btn-primary text-sm py-2 px-4">
            Start Scanning
          </button>
        ) : (
          <button onClick={stopScanner} className="btn-danger text-sm py-2 px-4">
            Stop
          </button>
        )}
      </div>

      <div id="qr-reader" ref={scannerRef} className="rounded-xl overflow-hidden" />

      {result && (
        <div className={`p-4 rounded-xl ${result.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.success ? (
              <HiCheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <HiXCircle className="w-6 h-6 text-red-400" />
            )}
            <span className={`font-semibold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </span>
          </div>
          {result.student && (
            <p className="text-dark-300 text-sm">Student: {result.student}</p>
          )}
          {result.event && (
            <p className="text-dark-300 text-sm">Event: {result.event}</p>
          )}
          <button onClick={() => { setResult(null); }} className="mt-3 btn-secondary text-sm py-1.5 px-3">
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
