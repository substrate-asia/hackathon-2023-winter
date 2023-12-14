import { useSelector } from "react-redux";
import { Button } from "../button";
import Card from "../card";
import { applyFormValueSelector } from "@/store/reducers/applySlice";

export default function ApplyProjectSubmitSidebar() {
  const formValue = useSelector(applyFormValueSelector);

  return (
    <Card>
      <Button
        onClick={() => {
          // eslint-disable-next-line
          console.log(formValue);
        }}
      >
        Submit
      </Button>
    </Card>
  );
}
