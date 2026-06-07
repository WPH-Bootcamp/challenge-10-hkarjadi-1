import Image from 'next/image';
import Link from 'next/link';

interface ProfileProps {
  userName?: string;
  profileImage?: string;
}

function Profile({ userName, profileImage }: ProfileProps) {
  return (
    <div>
      <div className='flex flex-row gap-2 md:gap-4 justify-start items-center'>
        <Link
          href='/profile'
          className='flex flex-row gap-2 md:gap-4 justify-start items-center hover:opacity-80 transition-opacity'
        >
          <div className='relative w-8 h-8 rounded-full overflow-hidden border border-gray-200'>
            <Image
              src={profileImage || './avatar.svg'}
              alt='Profile Image'
              fill
              className='object-cover'
            />
          </div>
          <p className='text-base text-white md:text-xl font-extrabold hidden sm:block'>
            {userName || 'User'}
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
