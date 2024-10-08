import { useRecoilState, useSetRecoilState } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "./useShowToast";
import { baseUrl } from "../../utilis/baseUrl";



const useLogout = () => {
    const setUser=useRecoilState(userAtom);
    const showToast=useShowToast()
    const logout = async () => {
		try {
			const res = await fetch(`${baseUrl}/users/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};

	return logout;
}

export default useLogout
