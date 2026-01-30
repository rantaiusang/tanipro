          {!piUser ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              {/* Ikon Dompet */}
              <Wallet className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              
              {/* Judul Baru */}
              <h3 className="font-bold text-gray-900 text-2xl mb-2">Login TANIPRO</h3>
              
              {/* Deskripsi */}
              <p className="text-gray-600 mb-6">Silakan hubungkan dompet Pi Anda untuk mengakses dashboard.</p>
              
              {/* Tombol Baru */}
              <button 
                onClick={handlePiLogin}
                disabled={!piSdkReady}
                className="bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 w-full sm:w-auto"
              >
                Login dengan Pi Network
              </button>
              
              {!piSdkReady && (
                <p className="text-xs text-gray-400 mt-3">Sedang memuat Pi SDK...</p>
              )}
            </div>
          ) : (
            // ... bagian jika sudah login tetap sama ...
