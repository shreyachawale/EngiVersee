// import React, { useState } from 'react';
// import { X, Star, Users, Tag, Calendar, MessageSquare, Send, Heart, CreditCard, Loader2 } from 'lucide-react';
// import { Project, Feedback } from '../../types/mentor';

// interface ProjectModalProps {
//   project: Project;
//   onClose: () => void;
//   onTogglePromising: (projectId: string) => void;
//   onSubmitFeedback: (projectId: string, feedback: string, rating: number) => void;
//   onPledgeFunding: (projectId: string, amount: number) => void;
// }

// const ProjectModal: React.FC<ProjectModalProps> = ({
//   project,
//   onClose,
//   onTogglePromising,
//   onSubmitFeedback,
//   onPledgeFunding
// }) => {
//   const [feedback, setFeedback] = useState('');
//   const [rating, setRating] = useState(5);
//   const [fundingAmount, setFundingAmount] = useState('');
//   const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
//   const [isPledging, setIsPledging] = useState(false);

//   const handleFeedbackSubmit = async () => {
//     if (feedback.trim()) {
//       setIsSubmittingFeedback(true);
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
//       onSubmitFeedback(project.id, feedback.trim(), rating);
//       setFeedback('');
//       setIsSubmittingFeedback(false);
//     }
//   };

//   const handleFundingPledge = async () => {
//     const amount = parseInt(fundingAmount);
//     if (amount > 0) {
//       setIsPledging(true);
//       try {
//         // Call backend to create Stripe Checkout session
//         const response = await fetch('http://localhost:5000/create-checkout-session', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             weddingId: project.id, // Using project.id as weddingId for demo
//             userId: 'demo-user'    // Replace with actual user ID if available
//           }),
//         });
//         const data = await response.json();
//         if (data.url) {
//           // Redirect to Stripe Checkout (recommended way)
//           window.location.href = data.url;
//         } else {
//           alert('Failed to create Stripe session');
//         }
//       } catch (err) {
//         alert('Error connecting to payment server');
//       }
//       setIsPledging(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
//         {/* ...existing code... */}
//         <div className="relative">
//           <img 
//             src={project.imageUrl} 
//             alt={project.title}
//             className="w-full h-64 object-cover"
//           />
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//           <div className="absolute bottom-4 left-4">
//             <button
//               onClick={() => onTogglePromising(project.id)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
//                 project.isPromising 
//                   ? 'bg-yellow-400 text-white shadow-lg' 
import React, { useState } from 'react';
import { X, Star, Users, Tag, Calendar, MessageSquare, Send, Heart, CreditCard, Loader2 } from 'lucide-react';
import { Project } from '../../types/mentor';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    onTogglePromising: (projectId: string) => void;
    onSubmitFeedback: (projectId: string, feedback: string, rating: number) => void;
    onPledgeFunding: (projectId: string, amount: number) => Promise<void>;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onTogglePromising, onSubmitFeedback, onPledgeFunding }) => {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [fundingAmount, setFundingAmount] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [isPledging, setIsPledging] = useState(false);

    const MIN_PLEDGE = 50;

    const handleFeedbackSubmit = async () => {
        if (!feedback.trim()) return;
        setIsSubmittingFeedback(true);
        await new Promise((r) => setTimeout(r, 700));
        onSubmitFeedback(project.id, feedback.trim(), rating);
        setFeedback('');
        setIsSubmittingFeedback(false);
    };

    const handleFundingPledge = async () => {
        const amount = Number(fundingAmount);
        if (Number.isNaN(amount) || amount <= 0) {
            alert('Please enter a valid pledge amount');
            return;
        }
        if (amount < MIN_PLEDGE) {
            alert(`Minimum pledge amount is ₹${MIN_PLEDGE}`);
            return;
        }

        setIsPledging(true);
        console.debug('ProjectModal: initiating pledge', { projectId: project.id, amount });
        try {
            await onPledgeFunding(project.id, amount);
            // If the parent redirected the page, this code won't run further.
            console.debug('ProjectModal: onPledgeFunding resolved (no redirect)');
        } catch (err) {
            console.error('ProjectModal: onPledgeFunding threw', err);
            alert('Failed to initiate pledge');
            throw err;
        } finally {
            // If parent redirected the browser this won't matter, but ensures spinner clears otherwise
            setIsPledging(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                <div className="relative">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover" />
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <button onClick={() => onTogglePromising(project.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-200 ${project.isPromising ? 'bg-yellow-400 text-white shadow-lg' : 'bg-white/80 text-gray-700 hover:bg-yellow-400 hover:text-white'}`}>
                            <Star className={`w-4 h-4 ${project.isPromising ? 'fill-current' : ''}`} />
                            {project.isPromising ? 'Marked as Promising' : 'Mark as Promising'}
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{project.title}</h1>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-emerald-600">₹{project.totalFunding.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">total funding</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{project.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{project.feedback.length} feedback</span>
                                </div>
                            </div>

                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-700 leading-relaxed">{project.fullDescription}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Team Members
                                    </h3>
                                    <div className="space-y-2">
                                        {project.team.map((member, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">{member.charAt(0)}</div>
                                                <span className="text-gray-700">{member}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Tag className="w-4 h-4" /> Technologies</h3>
                                    <div className="flex flex-wrap gap-2">{project.technologies.map((tech) => <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{tech}</span>)}</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Feedback & Comments</h3>
                                <div className="space-y-4 mb-6">{project.feedback.map((fb) => (
                                    <div key={fb.id} className="p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900">{fb.mentorName}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex">{Array.from({ length: 5 }, (_, i) => (<Star key={i} className={`w-4 h-4 ${i < (fb.rating ?? 0) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />))}</div>
                                                <span className="text-sm text-gray-500">{new Date(fb.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{fb.message}</p>
                                        <div className="text-xs text-gray-400 mt-2 text-right">{new Date(fb.timestamp).toLocaleDateString()}</div>
                                    </div>
                                ))}</div>
                            </div>
                        </div>

                        <div className="lg:w-1/3">
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Leave Feedback</h3>
                                    <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share your thoughts and suggestions..." className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
                                    <div className="mt-3 mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                        <div className="flex gap-1">{[1, 2, 3, 4, 5].map((star) => (<button key={star} onClick={() => setRating(star)} className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}><Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} /></button>))}</div>
                                    </div>
                                    <button onClick={handleFeedbackSubmit} disabled={!feedback.trim() || isSubmittingFeedback} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">{isSubmittingFeedback ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}</button>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pledge Funding</h3>
                                    <div className="mb-4"><label htmlFor="funding-amount" className="block text-sm font-medium text-gray-700 mb-1">Pledge Amount (₹)</label>
                                        <input id="funding-amount" type="number" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} placeholder="e.g., 5000" min="1" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" disabled={isPledging} />
                                    </div>

                                    <button onClick={handleFundingPledge} disabled={!fundingAmount || Number(fundingAmount) <= 0 || isPledging} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-4">{isPledging ? (<><Loader2 className="w-5 h-5 animate-spin" /> Redirecting...</>) : (<><Heart className="w-5 h-5" /> Pledge Funding Now</>)}</button>
                                    <p className="text-xs text-gray-500 mt-2">Secure payment processing via Stripe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;