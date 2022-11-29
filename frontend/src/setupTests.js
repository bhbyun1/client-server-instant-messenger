import Enzyme from "enzyme";
import EnzymeAdapter from "@cfaester/enzyme-adapter-react-18";

Enzyme.configure({
  adapter: new EnzymeAdapter(),
});