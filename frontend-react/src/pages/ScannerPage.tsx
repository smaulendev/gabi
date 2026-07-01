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

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }

      setIsScanning(false);
    } catch (error) {
      console.error("Error al detener escáner:", error);
      setIsScanning(false);
    }
  };

  const startScanner = async () => {
    try {
      if (scannerRef.current || isScanning) return;

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
          aspectRatio: 1.777,
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
      console.error("Error al iniciar escáner:", error);
      scannerRef.current = null;
      setIsScanning(false);
      toast.error(
        "No fue posible acceder a la cámara. En celular usa HTTPS o un despliegue seguro."
      );
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
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Escáner QR / Código de barras
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Identificación de bio-insumos mediante cámara o ingreso manual de
          código.
        </p>

        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
          Para usar la cámara desde un celular, abre la aplicación desde una URL
          segura HTTPS. En PC sin cámara puedes usar la búsqueda manual.
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-xl bg-white p-4 shadow-md sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Lectura por cámara
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Usa la cámara del dispositivo móvil para escanear QR o código de
              barras.
            </p>

            <div
              id="reader"
              className="mt-6 min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:min-h-[340px]"
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 sm:w-auto"
                >
                  Iniciar escáner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 sm:w-auto"
                >
                  Detener escáner
                </button>
              )}
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 shadow-md sm:p-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Búsqueda manual
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Útil para pruebas en PC o cuando no hay cámara disponible.
            </p>

            <form onSubmit={handleManualSearch} className="mt-6 space-y-4">
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                placeholder="Ej: 7801234567890"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
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
      </div>
    </Layout>
  );
}