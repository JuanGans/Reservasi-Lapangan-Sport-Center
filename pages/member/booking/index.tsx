import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/member/booking/detail",
      permanent: false,
    },
  };
};

export default function BookingIndexPage() {
  return null;
}
