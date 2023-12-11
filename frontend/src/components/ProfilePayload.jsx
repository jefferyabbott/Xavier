import React from 'react';

function ProfilePayload({ profile }) {
  if (profile) {
    return (
      <>
              <dl>
                <dt>Payload Display Name</dt>
                <dd>{profile.PayloadDisplayName}</dd>
              </dl>
              <dl>
                <dt>Payload Description</dt>
                <dd>{profile.PayloadDescription}</dd>
              </dl>
              <dl>
                <dt>Payload Organization</dt>
                <dd>{profile.PayloadOrganization}</dd>
              </dl>
              <dl>
                <dt>Payload Identifier</dt>
                <dd>{profile.PayloadIdentifier}</dd>
              </dl>
              <dl>
                <dt>Payload UUID</dt>
                <dd>{profile.PayloadUUID}</dd>
              </dl>
      </>
    )
  } else {
    return (null);
  }
  
}

export default ProfilePayload;