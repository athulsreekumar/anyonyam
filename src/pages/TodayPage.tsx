import { SectionHeading } from '@/components/molecules/SectionHeading'
import { Text } from '@/components/atoms/Text'
import { todayClosing, todayIntro, todayMiddle } from '@/content/today'

export function TodayPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Our Story" title="Anyonyam Today" />

      <div className="mt-8 flex flex-col gap-6">
        {todayIntro.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}

        <img
          src="/gallery/varshikam/varshikam-05.jpg"
          alt="Anyonyam Varshikam celebration"
          className="rounded-lg shadow-soft"
        />

        {todayMiddle.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}

        <img
          src="/gallery/football/football-04.jpg"
          alt="Anyonyam Football Mela"
          className="rounded-lg shadow-soft"
        />

        {todayClosing.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}
      </div>
    </article>
  )
}
