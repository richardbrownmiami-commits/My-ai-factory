import { useState } from 'react';

interface BuildStatus {
  id?: string;
  status: 'idle' | 'building' | 'success' | 'error';
  downloadUrl?: string;
  error?: string;
}

export default function ApkBuilder() {
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<'html' | 'react'>('react');
  const [appName, setAppName] = useState('MyApp');
  const [buildStatus, setBuildStatus] = useState<BuildStatus>({ status: 'idle' });
  const [history, setHistory] = useState<BuildStatus[]>([]);

  const handleBuild = async () => {
    if (!description.trim()) return;
    setBuildStatus({ status: 'building' });

    try {
      const payload = {
        code: `<!DOCTYPE html><html><head><title>${appName}</title></head><body><h1>${description}</h1></body></html>`,
        appName,
        packageName: `com.myai.${appName.toLowerCase().replace(/\s/g, '')}`,
      };

      const res = await fetch('https://demo2apk.lasuo.ai/api/build/html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as { id?: string; error?: string };

      if (data.id) {
        const newStatus: BuildStatus = {
          id: data.id,
          status: 'success',
          downloadUrl: `https://demo2apk.lasuo.ai/api/build/${data.id}/download`,
        };
        setBuildStatus(newStatus);
        setHistory((prev) => [newStatus, ...prev]);
      } else {
        const errorStatus: BuildStatus = { status: 'error', error: data.error || 'Build failed' };
        setBuildStatus(errorStatus);
      }
    } catch (e) {
      setBuildStatus({ status: 'error', error: String(e) });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-2">APK Builder</h1>
      <p className="text-gray-400 mb-6">Describe your app → get an APK</p>

      <div className="max-w-2xl space-y-4">
        <input
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
          placeholder="App name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />

        <textarea
          className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white h-32 resize-none"
          placeholder="Describe your app..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
          value={framework}
          onChange={(e) => setFramework(e.target.value as 'html' | 'react')}
        >
          <option value="html">HTML (Simple)</option>
          <option value="react">React/Vite</option>
        </select>

        <button
          onClick={handleBuild}
          disabled={buildStatus.status === 'building' || !description.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-lg py-3 font-semibold transition-colors"
        >
          {buildStatus.status === 'building' ? 'Building...' : 'Build APK'}
        </button>

        {buildStatus.status === 'success' && buildStatus.downloadUrl && (
          <a
            href={buildStatus.downloadUrl}
            className="block w-full text-center bg-green-600 hover:bg-green-500 rounded-lg py-3 font-semibold"
          >
            Download APK
          </a>
        )}

        {buildStatus.status === 'error' && (
          <p className="text-red-400 text-sm">{buildStatus.error}</p>
        )}

        {history.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Build History</h2>
            <div className="space-y-2">
              {history.map((b, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Build #{history.length - i}</span>
                  {b.downloadUrl && (
                    <a href={b.downloadUrl} className="text-blue-400 text-sm hover:underline">Download</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
