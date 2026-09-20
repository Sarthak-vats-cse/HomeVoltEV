import ChargingMap from "@/components/ChargingMap";

export default function MapTestPage() {
  return (
    <main className="w-screen h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">
        HomeVolt Map Test
      </h1>

      <div className="w-full h-[600px] rounded-2xl overflow-hidden border">
        <ChargingMap />
      </div>
    </main>
  );
}