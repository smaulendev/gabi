import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { toast } from "react-toastify";
import { Html5Qrcode } from "html5-qrcode";

export default function ScannerPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);

  const searchProduct = async (code: string) => {
    try {
      const response = await api.get(`/products/barcode/${code}`);

      if (!response.data) {
        setProduct(null);
        toast.error("Producto no encontrado");
        return;
      }

      setProduct(response.data);
      toast.success("Producto encontrado correctamente");
    } catch {
      setProduct(null);
      toast.error("Producto no encontrado");
    }
  };

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          setBarcode(decodedText);
          await searchProduct(decodedText);
          await stopScanner();
        },
        () => {}
      );

      setIsScanning(true);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible acceder a la cámara");
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }

      setIsScanning(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcode.trim()) {
      toast.error("Ingresa o escanea un código");
      return;
    }

    await searchProduct(barcode.trim());
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-slate-900">
        Escáner QR / Código de barras
      </h1>

      <p className="mt-2 text-slate-500">
        Identificación de bio-insumos mediante cámara o ingreso manual de código.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">
            Lectura por cámara
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Usa la cámara del dispositivo para escanear QR o código de barras.
          </p>

          <div
            id="reader"
            className="mt-6 overflow-hidden rounded-xl border border-slate-200"
          />

          <div className="mt-6 flex gap-3">
            {!isScanning ? (
              <button
                onClick={startScanner}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Iniciar escáner
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Detener escáner
              </button>
            )}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-bold text-slate-900">
            Búsqueda manual
          </h2>

          <form onSubmit={handleManualSearch} className="mt-6 space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2"
              placeholder="Ej: 7801234567890"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            >
              Buscar producto
            </button>
          </form>

          {product && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-bold text-slate-900">
                Producto encontrado
              </h3>

              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>
                  <strong>SKU:</strong> {product.sku}
                </p>
                <p>
                  <strong>Código:</strong> {product.barcode || "-"}
                </p>
                <p>
                  <strong>Nombre:</strong> {product.name}
                </p>
                <p>
                  <strong>Categoría:</strong> {product.category || "-"}
                </p>
                <p>
                  <strong>Cadena de frío:</strong>{" "}
                  {product.requiresColdChain ? "Sí" : "No"}
                </p>
                <p>
                  <strong>Rango temperatura:</strong>{" "}
                  {product.minTemperature ?? "-"}°C /{" "}
                  {product.maxTemperature ?? "-"}°C
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}