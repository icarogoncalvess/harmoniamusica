import React, { useState } from 'react';
import Icon from '../components/ui/Icon';

const modulesData = [
  {
    id: 1,
    title: 'Violão do zero',
    lessons: [
      { id: 1, title: 'Introdução e postura', duration: '10 min', completed: true, content: 'Aprenda como segurar o violão corretamente, posicionar os dedos no braço do instrumento e a postura ideal para evitar dores nas costas e nos pulsos.' },
      { id: 2, title: 'Acordes maiores (C, G, D, Em)', duration: '15 min', completed: false, content: 'Estes são os acordes fundamentais da música popular. Pratique a troca limpa entre Dó maior (C), Sol maior (G), Ré maior (D) e Mi menor (Em).' },
      { id: 3, title: 'Acordes menores (Am, Dm, Em)', duration: '12 min', completed: false, content: 'Os acordes menores dão a tonalidade melancólica e profunda às músicas. Veja como posicionar os dedos sem abafar as cordas vizinhas.' },
      { id: 4, title: 'Trocando entre acordes', duration: '20 min', completed: false, content: 'Exercícios práticos de agilidade com metrônomo para transitar entre acordes sem perder o ritmo.' },
      { id: 5, title: 'Primeiro ritmo completo', duration: '25 min', completed: false, content: 'Aplicação da batida de pop/rock básica usando toques para cima e para baixo.' }
    ]
  },
  {
    id: 2,
    title: 'Teoria musical básica',
    lessons: [
      { id: 6, title: 'O que são notas e tons', duration: '10 min', completed: true, content: 'Entenda a escala cromática, sustenidos (#) e bemóis (b).' },
      { id: 7, title: 'Formação de tríades', duration: '18 min', completed: true, content: 'Como a primeira, terça e quinta nota formam qualquer acorde maior ou menor.' }
    ]
  }
];

export default function Learn() {
  const [selectedModule, setSelectedModule] = useState(modulesData[0]);
  const [activeLesson, setActiveLesson] = useState(modulesData[0].lessons[0]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Icon name="book" className="w-8 h-8 text-orange-500" />
          Trilha de Aprendizado
        </h1>
        <p className="text-zinc-400">Evolua no instrumento com aulas práticas guiadas passo a passo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de Módulos */}
        <div className="space-y-4">
          {modulesData.map((mod) => (
            <div
              key={mod.id}
              onClick={() => {
                setSelectedModule(mod);
                setActiveLesson(mod.lessons[0]);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedModule.id === mod.id
                  ? 'bg-orange-500/10 border-orange-500'
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <h3 className="font-semibold text-lg">{mod.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{mod.lessons.length} aulas disponíveis</p>
            </div>
          ))}
        </div>

        {/* Detalhes do Módulo e Aulas */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-orange-400">Módulo: {selectedModule.title}</h2>

          <div className="space-y-3">
            {selectedModule.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition ${
                  activeLesson.id === lesson.id
                    ? 'bg-zinc-800 border border-orange-500/50'
                    : 'bg-zinc-950 hover:bg-zinc-800/50'
                }`}
              >
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <span className="text-xs text-zinc-400">{lesson.duration}</span>
                </div>
                {lesson.completed && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Concluído</span>}
              </div>
            ))}
          </div>

          {/* Conteúdo da Aula Selecionada */}
          {activeLesson && (
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <h3 className="text-lg font-semibold mb-2">Aula: {activeLesson.title}</h3>
              <p className="text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800/60">
                {activeLesson.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
