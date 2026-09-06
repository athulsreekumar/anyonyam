/**
 * Site-wide copy that isn't tied to a single page — org identity, vision/
 * mission, contact details, the upcoming-event banner. Kept as data rather
 * than inline JSX so it's trivial to update without touching component
 * code, and so the same values can be reused across Home + dedicated pages.
 */
export const org = {
  name: 'Anyonyam',
  malayalamName: 'അന്യോന്യം',
  tagline: 'Friendship, cooperation, and Vedic heritage among Tripunithura’s Namboodiri families since 1998.',
}

export const vision =
  'Develop and encourage friendship and cooperation among the members, preserve and maintain our rich Vedic culture, impart knowledge and training, and act as a change agent for the amendments that are necessitated by the passing of time.'

export const mission =
  'Indulging in activities to hold the members together for a common cause, facilitating members to practice routine Vedic rituals, maintaining the highest ethical standards, and standing out in the public domain as a model organization in all the areas engaged in.'

export const contact = {
  addressLines: [
    'Anyonyam Nalukettu',
    'Near Balavinayaka Temple, Kannankulangara',
    'Tripunithura, Ernakulam District',
    'Kerala – 682301',
  ],
  phone: '+91 94955 94281',
  phoneHref: 'tel:+919495594281',
  email: 'anyonyam2005@gmail.com',
}

// The upcoming-event banner used to be hardcoded here (which is why it was
// stuck showing a 2023 date). It's now admin-managed and fetched at runtime
// - see components/organisms/UpcomingEventBanner and backend routes/events.js.
