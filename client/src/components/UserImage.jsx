import { Box } from "@mui/system";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{
          borderRadius: "50%",
        }}
        width={size}
        height={size}
        alt="user"
        src={`https://sociopedia-server-u7qs.onrender.com/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
