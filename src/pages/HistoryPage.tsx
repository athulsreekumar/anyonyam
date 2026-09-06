import { SectionHeading } from '@/components/molecules/SectionHeading'
import { Text } from '@/components/atoms/Text'
import {
  historyActivities,
  historyClosing,
  historyIntro,
  historyMiddle,
  nalukettuStory,
  recognitionStory,
} from '@/content/history'

export function HistoryPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Our Story" title="History" />

      <div className="prose-content mt-8 flex flex-col gap-6">
        {historyIntro.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}

        <Text className="font-medium">Anyonyam’s other activities include:</Text>
        <ul className="list-disc space-y-2 pl-5">
          {historyActivities.map((activity) => (
            <li key={activity}>
              <Text as="span">{activity}</Text>
            </li>
          ))}
        </ul>

        <img
          src="/gallery/pathana-shibiram/pathana-shibiram-01.jpg"
          alt="Padana Sibiram educational seminar"
          className="rounded-lg shadow-soft"
        />

        <Text>{nalukettuStory}</Text>

        {historyMiddle.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}

        <Text>{recognitionStory}</Text>

        {historyClosing.map((paragraph) => (
          <Text key={paragraph.slice(0, 24)}>{paragraph}</Text>
        ))}
      </div>
    </article>
  )
}
