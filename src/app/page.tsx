import { FileUpload } from "@/components/FileUpload";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Audio File</h2>
        <p className="text-gray-600 mb-6">
          Upload your audio file and we'll separate the vocals from the
          accompaniment. Supported format: MP3
        </p>
        <FileUpload />
      </div>
    </div>
  );
}
