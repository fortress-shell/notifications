exports.CHECK_EXISTANCE = `
  SELECT 1
    FROM users
      WHERE id = $(user_id);
`;
