import data from '../public/data.json';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header-Bereich */}
        <header className="mb-16 text-center">
          <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
            KI-Experiment
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Tagesschau <span className="text-blue-600">Summarizer</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Automatische Video-Analysen der 20-Uhr-Sendung, erstellt von <span className="font-mono font-bold text-slate-800">Gemini 3.1 Flash-Lite</span>.
          </p>
        </header>

        {/* Liste der Zusammenfassungen */}
        <div className="space-y-10">
          {data.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
              <p className="text-slate-400 text-lg italic">
                Noch keine Daten vorhanden. Starte den Bot manuell in GitHub Actions oder warte bis 20:30 Uhr!
              </p>
            </div>
          ) : (
            data.map((item) => (
              <article 
                key={item.id} 
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden hover:border-blue-200 transition-colors duration-300"
              >
                <div className="p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {item.title}
                    </h2>
                    <time className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg shrink-0">
                      {new Date(item.date).toLocaleDateString('de-DE', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </time>
                  </div>
                  
                  <div className="mb-8">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      Original auf YouTube ansehen
                    </a>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <div className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                      {item.summary}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Video Analysis Status: Complete
                  </span>
                  <div className="flex space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-20 pb-12 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} KI-Dashboard • Gebaut mit Next.js, Gemini & GitHub Actions</p>
        </footer>
      </div>
    </main>
  );
}
