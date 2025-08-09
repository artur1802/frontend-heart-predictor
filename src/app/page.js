import Image from "next/image";
import HeartPredictionForm from "./components/HeartPredictionForm";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-white min-h-screen p-8 pb-20">
      <main className="max-w-4xl mx-auto">
       
        <HeartPredictionForm/>
      </main>
      
      
    </div>
  );
}
