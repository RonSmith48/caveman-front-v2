import React from 'react';

const ProfileAvatar = ({ user, size = 40 }) => {
  const { avatar, full_name, initials } = user || {};
  const hasAvatar = avatar && avatar.filename;

  return hasAvatar ? (
    <img
      src={`/images/avatars/${avatar.filename}`}
      alt={full_name || 'avatar'}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: avatar.bg_colour || '#ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        color: avatar.fg_colour || '#fff',
        textTransform: 'uppercase'
      }}
      title={full_name}
    >
      {initials || '?'}
    </div>
  );
};

export default ProfileAvatar;
