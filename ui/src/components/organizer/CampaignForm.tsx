interface CampaignFormProps {
  name: string; setName: (val: string) => void;
  target: string; setTarget: (val: string) => void;
  desc: string; setDesc: (val: string) => void;
}

export function CampaignForm({ name, setName, target, setTarget, desc, setDesc }: CampaignFormProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Nume Campanie */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Nume Campanie</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium"
            placeholder="ex. Salvează Pădurile"
          />
        </div>

        {/* Țintă Sumă */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Țintă Strângere (SUI)</label>
          <div className="relative">
            <input 
              type="number" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium pl-12"
              placeholder="1000"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">SUI</span>
          </div>
        </div>
      </div>

      {/* Descriere */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Descriere</label>
        <textarea 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none h-32 resize-none"
          placeholder="Spune donatorilor ce vei face cu acești bani..."
        />
      </div>
    </>
  );
}
