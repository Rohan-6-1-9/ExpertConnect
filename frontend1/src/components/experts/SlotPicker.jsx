import { useState } from 'react'
import { format, addDays, startOfToday } from 'date-fns'
import { cn, formatDate } from '../../utils'
import { Skeleton } from '../ui'

const TODAY = startOfToday()
const NEXT_14_DAYS = Array.from({ length: 14 }, (_, i) => addDays(TODAY, i))

export default function SlotPicker({ slots, loading, selectedDate, onDateChange, selectedSlot, onSlotSelect }) {
  const available = slots.filter(s => s.status === 'available' || !s.status)
  const booked    = slots.filter(s => s.status === 'booked')

  return (
    <div className="space-y-5">
      {/* Date strip */}
      <div>
        <p className="section-label mb-3">Select Date</p>
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {NEXT_14_DAYS.map(date => {
            const key = format(date, 'yyyy-MM-dd')
            const isSelected = selectedDate === key
            const isToday = format(TODAY, 'yyyy-MM-dd') === key
            return (
              <button
                key={key}
                onClick={() => onDateChange(key)}
                className={cn(
                  'flex-shrink-0 snap-start flex flex-col items-center px-3 py-2.5 rounded-xl border transition-all duration-150 min-w-[56px]',
                  isSelected
                    ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
                    : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400'
                )}
              >
                <span className={cn('text-[10px] font-mono uppercase', isSelected ? 'text-ink-300' : 'text-ink-400')}>
                  {format(date, 'EEE')}
                </span>
                <span className="font-display font-semibold text-sm mt-0.5">
                  {format(date, 'd')}
                </span>
                {isToday && (
                  <span className={cn('w-1 h-1 rounded-full mt-0.5', isSelected ? 'bg-gold-400' : 'bg-gold-500')} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Slot grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-label">Available Times</p>
          {selectedDate && (
            <span className="text-xs text-ink-500 font-mono">
              {formatDate(selectedDate, 'MMMM d, yyyy')}
            </span>
          )}
        </div>

        {!selectedDate ? (
          <p className="text-sm text-ink-400 italic text-center py-8 border border-dashed border-ink-200 rounded-xl">
            Select a date to view available slots
          </p>
        ) : loading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-ink-400 italic text-center py-8 border border-dashed border-ink-200 rounded-xl">
            No slots available for this date
          </p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map(slot => {
  const slotId = slot._id || slot.id

  const isBooked =
    slot.isBooked === true ||
    slot.status === 'booked'

  const isSelected = selectedSlot === slotId

  return (
    <button
      key={slotId}
      disabled={isBooked}
      onClick={() => {
        if (!isBooked) {
          onSlotSelect(isSelected ? null : slotId)
        }
      }}
      className={cn(
        'relative px-2 py-2.5 rounded-lg text-xs font-mono font-medium border transition-all duration-200 text-center',
        isBooked
          ? 'bg-ink-50 text-ink-300 border-ink-100 cursor-not-allowed line-through'
          : isSelected
            ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
            : 'bg-white text-ink-700 border-ink-200 hover:border-gold-400 hover:bg-gold-50'
      )}
    >
      {slot.time || slot.startTime}

      {isBooked && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full border-2 border-white" />
      )}
    </button>
  )
})}
          </div>
        )}

        {/* Legend */}
        {slots.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-xs text-ink-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-white border border-ink-200" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-ink-900" /> Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-ink-50 border border-ink-100" /> Booked
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
