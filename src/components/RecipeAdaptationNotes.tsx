import React from 'react';

interface RecipeAdaptationNotesProps {
  adaptationNotes?: string[];
  isAdapted?: boolean;
}

const RecipeAdaptationNotes: React.FC<RecipeAdaptationNotesProps> = ({
  adaptationNotes,
  isAdapted
}) => {
  if (!adaptationNotes || adaptationNotes.length === 0) {
    return null;
  }

  const title = adaptationNotes[0];
  const notes = adaptationNotes.slice(1);

  return (
    <div className={`mt-6 p-4 rounded-lg ${isAdapted ? 'bg-green-50' : 'bg-amber-50'}`}>
      <h3 className={`text-lg font-medium mb-2 ${isAdapted ? 'text-green-800' : 'text-amber-800'}`}>
        {title}
      </h3>
      
      {notes.length > 0 && (
        <ul className={`list-disc pl-5 mt-2 ${isAdapted ? 'text-green-700' : 'text-amber-700'}`}>
          {notes.map((note, index) => (
            <li key={index} className="mt-1">
              {note}
            </li>
          ))}
        </ul>
      )}
      
      {!isAdapted && (
        <p className="mt-3 text-sm text-amber-600">
          This recipe could not be fully adapted. You may want to try a different dietary preference or modify the recipe manually.
        </p>
      )}
    </div>
  );
};

export default RecipeAdaptationNotes; 