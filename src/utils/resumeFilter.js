export function filterRelevantSkills(skills, role) {
  const roleLower = role.toLowerCase();

  return skills.filter(skill => {
    const name = skill.skill_name.toLowerCase();
    const category = skill.category?.toLowerCase() || "";

    return (
      roleLower.includes(name) ||
      name.includes(roleLower) ||
      roleLower.includes(category)
    );
  });
}
