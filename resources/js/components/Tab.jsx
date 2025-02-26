const Tab = ({ name, label, children, checked }) => {
  return (
    <>
      <input
        type="radio"
        name={name}
        role="tab"
        className="tab"
        aria-label={label}
        checked={checked}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
      >
        {children}
      </div>
    </>
  );
};

export default Tab;
