import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarItem, NavbarContent } from '@nextui-org/navbar'

const links = [
	{ label: 'Statistics', href: '/statistics' },
  { label: 'Insights', href: '/insights' },
  { label: 'Settings', href: '/settings' }
]

const Appbar = () => {
	const router = useRouter()

	return (
		<Navbar
      isBordered
      className="max-sm:hidden w-full bg-zinc-100 dark:bg-zinc-900 pb-safe z-50">
      <NavbarBrand>
        <Link href='/' passHref>
        <p>SpeakSense</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="mx-auto flex h-16 max-w-md  justify-around px-6">
          {links.map(({ href, label }) => (
            <NavbarItem key={label} isActive={router.pathname === href}>
              <Link href={href} passHref>
                <div
                  className={`flex h-full w-full flex-col  justify-center space-y-1 ${
                    router.pathname === href
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
                >
                  <p>
                    {label}
                  </p>
                </div>
              </Link>
            </NavbarItem>
          ))}
          {/* Profile Button */}
          <div className="ml-4">
            <Link href="/profile" passHref>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-500">
                <img
                  src="../images/Ian (1).png" 
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              </Link>
              </div>
        </NavbarContent>
    </Navbar>

	)
}

export default Appbar
