import React, { useState } from 'react';
import { Award, Upload, FileText } from 'lucide-react';

interface CertificationModalProps {
  user: any;
  onClose: () => void;
  onSubmit: (data: { category: string; reason: string; proof: string }) => void;
}

const CertificationModal: React.FC<CertificationModalProps> = ({ user, onClose, onSubmit }) => {
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [proof, setProof] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ category, reason, proof });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass w-full max-w-md rounded-2xl overflow-hidden border border-white/20">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-500" />
          <h2 className="font-bold text-lg">Demande de certification</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 rounded-lg px-4 py-2 outline-none border border-white/10" required>
              <option value="">Sélectionner...</option>
              <option value="artist">Artiste / Musicien</option>
              <option value="athlete">Athète</option>
              <option value="influencer">Influenceur</option>
              <option value="business">Business / Marque</option>
              <option value="journalist">Journaliste</option>
              <option value="creator">Créateur de contenu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Raison de la demande</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Expliquez pourquoi vous méritez la certification..." className="w-full bg-white/5 rounded-lg px-4 py-2 outline-none border border-white/10 min-h-24" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preuve (lien vers article, portfolio, etc.)</label>
            <input type="url" value={proof} onChange={(e) => setProof(e.target.value)} placeholder="https://..." className="w-full bg-white/5 rounded-lg px-4 py-2 outline-none border border-white/10" required />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 bg-white/10 rounded-lg font-medium">Annuler</button>
            <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg font-medium">Soumettre</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;
