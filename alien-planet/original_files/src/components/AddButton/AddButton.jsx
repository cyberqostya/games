import "./AddButton.scss";

export const AddButton = (props) => {
  return (
    <button style={props.style} className="add-button" onClick={props.onClick}>
      Добавить жертву
    </button>
  );
};
