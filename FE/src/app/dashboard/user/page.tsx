import UserTable from "@/components/admin/user.table";
import SafeHydrate from "@/lib/SafeHydrate";

const ManageUserPage = () => {
  return (
    <div>
      <SafeHydrate>
        <UserTable />
      </SafeHydrate>
    </div>
  );
};

export default ManageUserPage;
