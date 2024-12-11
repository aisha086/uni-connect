export function CabinetMemberList({ cabinetMembers }) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium">Cabinet Members</h3>
        {cabinetMembers.length === 0 ? (
          <p>No members added yet.</p>
        ) : (
          <ul className="list-disc ml-5">
            {cabinetMembers.map((member, index) => (
              <li key={index}>
                {member.name} - {member.designation}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  