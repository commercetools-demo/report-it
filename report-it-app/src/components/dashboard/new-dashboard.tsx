type Props = {
  openModal: () => void;
};

const NewDashboard = ({ openModal }: Props) => {
  return (
    <button type="button" onClick={() => openModal()}>
      +
    </button>
  );
};

export default NewDashboard;
