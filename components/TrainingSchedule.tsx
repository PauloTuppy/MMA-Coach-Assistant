import React from 'react';
import type { TrainingSchedule as TrainingScheduleType } from '../types';

interface TrainingScheduleProps {
    schedule: TrainingScheduleType;
    fighterName: string;
}

const DayCard: React.FC<{ day: string, task: string }> = ({ day, task }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
        <p className="text-sm font-bold uppercase text-red-500 mb-2">{day}</p>
        <p className="text-gray-300 text-sm flex-grow">{task}</p>
    </div>
);


export const TrainingSchedule: React.FC<TrainingScheduleProps> = ({ schedule, fighterName }) => {
    const days = Object.keys(schedule) as (keyof TrainingScheduleType)[];

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                Weekly Training Schedule for <span className="text-red-500">{fighterName}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Special handling for 7 days on a 4-col grid */}
                {days.slice(0, 4).map(day => (
                     <DayCard key={day} day={day} task={schedule[day]} />
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                 {days.slice(4).map(day => (
                     <DayCard key={day} day={day} task={schedule[day]} />
                ))}
            </div>
        </div>
    );
};
