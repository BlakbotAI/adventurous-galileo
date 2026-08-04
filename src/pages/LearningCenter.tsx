import React, { useState } from 'react';
import { GraduationCap, Award, HelpCircle, ArrowRight, CheckCircle2, XCircle, RefreshCw, FileText, ChevronRight } from 'lucide-react';
import { db } from '../services/db';

export const LearningCenter: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'Student' | 'Teacher'>('Student');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const quizQuestions = db.getQuizQuestions();

  const handleOptionSelect = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === quizQuestions[currentQuestionIndex].answerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Mode selectors */}
      <div className="flex justify-between items-center border-b border-gold-500/10 pb-4">
        <div className="flex gap-2">
          {(['Student', 'Teacher'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-4 py-1.5 rounded-lg text-xs font-sans tracking-wide border transition-all ${
                activeMode === mode
                  ? 'bg-gradient-to-r from-gold-600 to-bronze-600 text-black border-gold-500 font-bold shadow-md shadow-gold-500/10'
                  : 'bg-matte-900 border-gold-500/10 hover:border-gold-500/30 text-gray-400'
              }`}
            >
              {mode === 'Student' ? 'Interactive Classroom' : 'Educator Curriculum'}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-gray-500 tracking-wider flex items-center gap-1.5 font-mono">
          <GraduationCap size={14} className="text-gold-500" /> ACCREDITED STATUS: GLOBAL
        </span>
      </div>

      {activeMode === 'Student' ? (
        /* Quiz Area */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl glass-panel border border-gold-500/15 p-6 space-y-6 bg-matte-950 flex flex-col justify-between">
            {quizQuestions.length === 0 ? (
              <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full space-y-3 min-h-[250px]">
                <HelpCircle size={36} className="text-gold-500/30 animate-pulse" />
                <h4 className="text-xs font-serif text-white uppercase tracking-wider font-semibold">Quiz Pool Unpopulated</h4>
                <p className="text-[11px] text-gray-500 max-w-xs mx-auto">No educational questions have been added by curators yet. Go to the Curator Panel to create one.</p>
              </div>
            ) : !quizComplete ? (
              <>
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                    <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span>Correct Score: {score}</span>
                  </div>

                  {/* Question */}
                  <h3 className="text-base md:text-lg font-serif text-white font-bold leading-relaxed">
                    {quizQuestions[currentQuestionIndex]?.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    {quizQuestions[currentQuestionIndex].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === quizQuestions[currentQuestionIndex].answerIndex;
                      
                      let optionStyle = 'bg-matte-900/50 border-gold-500/5 hover:border-gold-500/20 text-gray-300';
                      if (isSelected) optionStyle = 'bg-gold-950/20 border-gold-500 text-gold-400';
                      
                      if (isAnswerSubmitted) {
                        if (isCorrect) optionStyle = 'bg-green-950/30 border-green-500 text-green-400';
                        else if (isSelected) optionStyle = 'bg-red-950/30 border-red-500 text-red-400';
                        else optionStyle = 'bg-matte-900/10 border-transparent text-gray-600';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleOptionSelect(idx)}
                          className={`w-full p-4 rounded-xl text-left border text-xs transition-all flex justify-between items-center ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && isCorrect && <CheckCircle2 size={14} className="text-green-500 shrink-0" />}
                          {isAnswerSubmitted && isSelected && !isCorrect && <XCircle size={14} className="text-red-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation or Action */}
                <div className="pt-6 border-t border-gold-500/5 space-y-4">
                  {isAnswerSubmitted && (
                    <div className="p-3 rounded-lg bg-gold-950/10 border border-gold-500/10 text-[11px] text-gray-400 leading-relaxed font-light">
                      <strong className="text-gold-400 font-semibold block mb-0.5">Archival Clarification:</strong>
                      {quizQuestions[currentQuestionIndex].explanation}
                    </div>
                  )}

                  <div className="flex justify-end">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedOption === null}
                        className="px-5 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 disabled:bg-gray-800 disabled:text-gray-500 text-black text-xs font-bold transition-all shadow-md shadow-gold-500/10"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-gold-600 to-bronze-600 hover:from-gold-500 hover:to-bronze-500 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-gold-500/10"
                      >
                        {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Assessment' : 'Next Question'} <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Quiz Finished */
              <div className="text-center py-10 space-y-6 flex flex-col items-center justify-center flex-1">
                <div className="p-4 rounded-full bg-gold-950/20 border-2 border-gold-500 text-gold-500 animate-pulse">
                  <Award size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif text-white font-bold">Assessment Complete</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto font-light leading-relaxed">
                    You have successfully finalized the Decolonial African World View Assessment module.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-matte-900 border border-gold-500/10 w-72 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Graduation Score:</span>
                  <span className="text-gold-500 font-serif font-black text-base glow-gold-text">{score} / {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)</span>
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-lg bg-matte-900 hover:bg-matte-850 border border-gold-500/20 text-gold-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <RefreshCw size={14} /> Restart Assessment
                </button>
              </div>
            )}
          </div>

          {/* Quick Quiz Info Right Sidebar */}
          <div className="p-5 rounded-xl glass-panel border border-gold-500/10 h-fit space-y-4">
            <h4 className="text-xs font-serif text-gold-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={14} /> Learning Objectives
            </h4>
            <ul className="space-y-2.5 text-[11px] text-gray-400 font-light leading-relaxed">
              <li className="flex gap-2"><ChevronRight size={12} className="text-gold-500 mt-0.5" /> Deconstruct colonial narratives concerning sub-Saharan scientific limitations.</li>
              <li className="flex gap-2"><ChevronRight size={12} className="text-gold-500 mt-0.5" /> Understand early state models in Nubia and Nile Valleys.</li>
              <li className="flex gap-2"><ChevronRight size={12} className="text-gold-500 mt-0.5" /> Quantify pre-colonial metallurgical expansion routes.</li>
            </ul>
          </div>
        </div>
      ) : (
        /* Teacher Mode curriculum sheets */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4">
            <h3 className="text-base font-serif text-gold-500 font-bold border-b border-gold-500/10 pb-2">
              High School Lesson Plans (Grades 9-12)
            </h3>
            <div className="space-y-3">
              {[
                { title: 'The Mathematics of Ishango: Deep African Chronology', time: '2 Weeks duration' },
                { title: 'Kushite Dynasties: The Nubian Pharaonic Invasions', time: '1 Week duration' },
                { title: 'Timbuktu Manuscripts: Astronomy & Geometry', time: '3 Weeks duration' }
              ].map((lesson, idx) => (
                <div key={idx} className="p-3 rounded bg-matte-900 border border-gold-500/5 hover:border-gold-500/20 cursor-pointer flex justify-between items-center transition-colors">
                  <div>
                    <h4 className="text-xs text-white font-semibold font-serif">{lesson.title}</h4>
                    <span className="text-[9px] text-gray-500 font-mono mt-0.5 block">{lesson.time}</span>
                  </div>
                  <span className="p-1 rounded bg-gold-950/20 text-gold-500"><FileText size={12} /></span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl glass-panel border border-gold-500/10 space-y-4">
            <h3 className="text-base font-serif text-gold-500 font-bold border-b border-gold-500/10 pb-2">
              Worksheet templates
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Nok Smelting vs Carthage Timelines (Matching Sheet)' },
                { title: 'Mapping Trans-Saharan Commercial Routes (Map Work)' },
                { title: 'Analyzing Kouroukan Fuga Articles (Source Analysis)' }
              ].map((sheet, idx) => (
                <div key={idx} className="p-3 rounded bg-matte-900 border border-gold-500/5 hover:border-gold-500/20 cursor-pointer flex justify-between items-center transition-colors">
                  <h4 className="text-xs text-white font-serif">{sheet.title}</h4>
                  <span className="p-1 rounded bg-gold-950/20 text-gold-500"><FileText size={12} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LearningCenter;
