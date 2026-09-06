export interface NavItem {
  label: string
  to: string
}

export const publicNavItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'History', to: '/about/history' },
  { label: 'Anyonyam Today', to: '/about/today' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

/** Nav items shown once a member is logged in, replacing the public set. */
export function getAuthNavItems(memberNo: number | null, isAdmin: boolean): NavItem[] {
  return [
    { label: 'My Profile', to: `/profile/${memberNo}` },
    { label: 'Directory', to: '/directory' },
    { label: 'Requests', to: '/requests' },
    ...(isAdmin ? [{ label: 'Admin', to: '/admin' }, { label: 'Search', to: '/search' }] : []),
    { label: 'Logout', to: '/logout' },
  ]
}
