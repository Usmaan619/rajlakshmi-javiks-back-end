const { withConnection } = require("../../../utils/helper");

// GET all 4 banners
exports.getRajlaxmiAllBanners = async () => {
  try {
    return await withConnection(async (connection) => {
      const query = "SELECT * FROM rajlaxmi_home_banners WHERE id = 1";
      const [rows] = await connection.execute(query);
      return rows[0];
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

// UPDATE single banner slot
// exports.updateBannerSlot = async (slot, url) => {
//   try {
//     return await withConnection(async (connection) => {
//       const column = `banner${slot}`;
//       const query = `UPDATE rajlaxmi_home_banners SET ${column} = ? WHERE id = 1`;
//       await connection.execute(query, [url]);
//       return true;
//     });
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

exports.updateBannerSlotRajlaxmi = async (slot, url) => {
  try {
    return await withConnection(async (connection) => {
      const column = `banner${slot}`;
      const query = `UPDATE rajlaxmi_home_banners SET ${column} = ? WHERE id = 1`;

      console.log("\n----- SQL DEBUG -----");
      console.log("QUERY:", query);
      console.log("VALUE:", url);

      const [result] = await connection.execute(query, [url]);

      console.log("SQL RESULT:", result);
      console.log("---------------------\n");

      return result;
    });
  } catch (error) {
    console.log("Update error:", error);
    throw new Error(error.message);
  }
};

// GET existing banner (to delete from S3)
exports.getBannerSlotRajlaxmi = async (slot) => {
  try {
    return await withConnection(async (connection) => {
      const column = `banner${slot}`;
      const query = `SELECT ${column} AS banner FROM rajlaxmi_home_banners WHERE id = 1`;

      const [rows] = await connection.execute(query);
      return rows[0]?.banner || null;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.ensureHomeBannerRowRajlaxmi = async () => {
  try {
    return await withConnection(async (connection) => {
      const [rows] = await connection.execute(
        "SELECT COUNT(*) AS total FROM rajlaxmi_home_banners WHERE id = 1"
      );

      if (rows[0].total === 0) {
        await connection.execute(
          "INSERT INTO rajlaxmi_home_banners (id, banner1, banner2, banner3, banner4) VALUES (1, NULL, NULL, NULL, NULL)"
        );
      }
    });
  } catch (err) {
    console.log("ensureHomeBannerRow error:", err);
  }
};
