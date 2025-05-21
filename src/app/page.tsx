export default function Home() {
  return (
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className="p-4 bg-white shadow text-xl font-semibold">
          Chat dengan Budi
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Pesan dari orang lain */}
          <div className="max-w-[70%] bg-gray-200 p-3 rounded-lg">
            Halo, apa kabar?
          </div>

          {/* Pesan dari kita */}
          <div className="max-w-[70%] bg-blue-600 text-white p-3 rounded-lg self-end ml-auto">
            Baik! Kamu gimana?
          </div>
        </main>

        {/* Input Pesan */}
        <form className="p-4 bg-white border-t flex items-center gap-2">
          <input
              type="text"
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Kirim
          </button>
        </form>
      </div>
  );
}
