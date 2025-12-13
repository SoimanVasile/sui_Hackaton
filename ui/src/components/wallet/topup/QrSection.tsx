import QRCode from "react-qr-code";

interface QrSectionProps {
  address: string;
}

export function QrSection({ address }: QrSectionProps) {
  return (
    <>
      <p className="text-gray-500 mb-6 font-medium">
        Scan this with your mobile wallet to autofill address
      </p>

      <div className="bg-white border-2 border-dashed border-brand-200 p-4 w-fit mx-auto rounded-2xl mb-6 shadow-sm">
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 160, width: "100%" }}>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={address}
            viewBox={`0 0 256 256`}
            fgColor="#7c3aed"
          />
        </div>
      </div>
    </>
  );
}
