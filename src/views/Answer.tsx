import { CORPSES_DATA } from '../data/corpses';

export function Answer() {
    return (
        <div className="p-4 bg-black text-white font-mono">
            <h1 className="text-xl text-red-500 mb-4">Answer Key / Data Source</h1>
            <pre className="text-xs text-green-500 whitespace-pre-wrap">
                {JSON.stringify(CORPSES_DATA, null, 2)}
            </pre>
        </div>
    );
}
