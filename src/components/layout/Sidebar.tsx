import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
  {
    name: '홈',
    path: '/dashboard',
    icon: '/home.svg',
  },
  // {
  //   name: '위치추적',
  //   path: '/location',
  //   icon: '/location.svg',
  // },
  // {
  //   name: '타임캡슐',
  //   path: '/timecapsule',
  //   icon: '/timecapsule.svg',
  // },
  {
    name: '루틴',
    path: '/routine',
    icon: '/routine.svg',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center h-24 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="Refo" className="w-32 h-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            let isActive = location.pathname !== "/" && location.pathname.startsWith(item.path);
            if(item.path === '/') {
              // 홈 경로가 활성화된 경우 대시보드로 간주
              isActive = location.pathname === '/dashboard';
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-4 px-4 py-3 rounded-xl 
                  transition-all duration-300 ease-in-out
                  ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'text-neutral-gray-dark hover:bg-primary/10 hover:text-primary hover:translate-x-1 hover:shadow-sm'
                  }
                `}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isActive ? '' : 'group-hover:scale-110'
                  }`}
                  style={{
                    filter: isActive
                      ? 'brightness(0) invert(1)'
                      : undefined,
                  }}
                />
                <span className={`font-semibold ${isActive ? 'text-white' : 'text-[#9E9E9E]'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16">
          {navigationItems.map((item) => {
            let isActive = location.pathname !== "/" && location.pathname.startsWith(item.path);
            if(item.path === '/') {
              // 홈 경로가 활성화된 경우 대시보드로 간주
              isActive = location.pathname === '/dashboard';
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? 'text-primary' : 'text-neutral-gray-medium'
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6"
                  style={{
                    filter: isActive
                      ? 'invert(56%) sepia(47%) saturate(459%) hue-rotate(208deg) brightness(94%) contrast(90%)'
                      : 'invert(47%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(98%) contrast(89%)',
                  }}
                />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
