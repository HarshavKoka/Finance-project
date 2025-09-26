import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PersonForm from "../components/PersonForm";
import PersonTable from "../components/PersonTable";

export interface Person {
  name: string;
  dob: string;
  city: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  panName?: string;
  panNumber?: string;
  itrLast3Years?: string;
  username?: string;
  password?: string;
  gstNumber?: string;
  businessName?: string;
  companyName?: string;
}

const PeoplePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showInfo, setShowInfo] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  let group: "IncomeTax" | "GST" | "MCA" = "IncomeTax";
  if (location.pathname.includes("gst")) group = "GST";
  else if (location.pathname.includes("mca")) group = "MCA";
  else if (location.pathname.includes("incometax")) group = "IncomeTax";

  const LOCAL_KEY = `people_data_${group}`;
  const queryClient = useQueryClient();

  const { data: people = [] } = useQuery<Person[]>({
    queryKey: ["people", group],
    queryFn: async () => {
      const stored = localStorage.getItem(LOCAL_KEY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const addPersonMutation = useMutation({
    mutationFn: async (person: Person) => person,
    onSuccess: (newPerson) => {
      queryClient.setQueryData<Person[]>(["people", group], (old = []) => {
        const updated = [...old, newPerson];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      setShowForm(false);
    },
  });

  const deletePersonMutation = useMutation({
    mutationFn: async (index: number) => index,
    onSuccess: (index) => {
      queryClient.setQueryData<Person[]>(["people", group], (old = []) => {
        const updated = old.filter((_, i) => i !== index);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
    },
  });

  const addPerson = (person: Person) => addPersonMutation.mutate(person);
  const deletePerson = (index: number) => {
    deletePersonMutation.mutate(index);
    setSearchTerm("");
    setSuggestions([]);
    setSearchResults([]);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setHighlightIndex(-1);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = value.toLowerCase();
    const filtered = people.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.panNumber && p.panNumber.toLowerCase().includes(lower)) ||
        (p.phoneNumber && p.phoneNumber.includes(lower))
    );
    setSuggestions(filtered.slice(0, 6));
  };

  const handleSelectSuggestion = (person: Person) => {
    setSearchTerm(person.name);
    setSuggestions([]);
    setSearchResults([person]);
    setHighlightIndex(-1);
  };

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const results = people.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.panNumber && p.panNumber.toLowerCase().includes(lower)) ||
        (p.phoneNumber && p.phoneNumber.includes(lower))
    );
    setSuggestions([]);
    setSearchResults(results);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[highlightIndex]);
      } else {
        handleSearchClick();
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-blue-700">
          {group} People Manager
        </h1>
        <div className="flex flex-col items-end space-y-5">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition cursor-pointer"
          >
            Back to Home
          </button>
          {group === "GST" && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
            >
              {showInfo ? "Hide GST Info" : "Show GST Info"}
            </button>
          )}
          {group === "MCA" && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              {showInfo ? "Hide MCA Info" : "Show MCA Info"}
            </button>
          )}
          {group === "IncomeTax" && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 cursor-pointer"
            >
              {showInfo ? "Hide ITR Info" : "Show ITR Info"}
            </button>
          )}
        </div>
      </div>
      {showInfo && group === "GST" && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">
            GST Information
          </h2>
          <p>
            Goods and Services Tax (GST) is a comprehensive indirect tax
            system...
          </p>
          <p>CGST, SGST, IGST, UTGST components...</p>
          <p>GST Returns: GSTR-1, GSTR-3B, GSTR-9...</p>
          <p>Businesses must obtain GSTIN and file returns regularly...</p>
        </div>
      )}
      {showInfo && group === "MCA" && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">
            MCA Information
          </h2>
          <p>
            MCA portal manages company and corporate activities digitally...
          </p>
          <p>Company incorporation simplified with SPICe+...</p>
          <p>Regulatory compliance, online filing, real-time tracking...</p>
          <p>
            Portal provides incorporation, DIN, LLP registration, compliance
            monitoring...
          </p>
        </div>
      )}
      {showInfo && group === "IncomeTax" && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">
            ITR Information
          </h2>
          <p>
            Income Tax Return (ITR) declares income, deductions, and taxes...
          </p>
          <p>ITR forms: ITR-1, ITR-2, ITR-3, ITR-4, ITR-5/6/7...</p>
          <p>Filing deadlines: 31 July (individuals), 31 Oct (audit), etc...</p>
          <p>
            Mandatory for those above exemption limit, or claiming refunds...
          </p>
        </div>
      )}
      {showInfo && group === "GST" && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          {" "}
          <h2 className="text-lg font-semibold text-gray-700">
            {" "}
            GST Information{" "}
          </h2>{" "}
          <p>
            {" "}
            Goods and Services Tax (GST) is a comprehensive indirect tax system
            introduced in India on 1st July 2017. It replaced multiple indirect
            taxes like VAT, Service Tax, and Excise Duty, bringing them under
            one uniform structure. GST is a destination-based tax, meaning it is
            collected where goods or services are consumed rather than where
            they are produced. It is levied on the supply of goods and services
            at different rates such as 0%, 5%, 12%, 18%, and 28%, depending on
            the category of the product or service.{" "}
          </p>{" "}
          <p>
            {" "}
            There are four components of GST in India: CGST (Central GST)
            collected by the Central Government, SGST (State GST) collected by
            State Governments, IGST (Integrated GST) for interstate trade, and
            UTGST (Union Territory GST) for Union Territories. Businesses
            registered under GST collect tax from customers and then deposit it
            with the government after adjusting input tax credit (ITC). ITC
            allows businesses to reduce their tax liability by claiming credit
            for taxes already paid on purchases.{" "}
          </p>{" "}
          <p>
            {" "}
            A GST Return is a document filed by GST-registered taxpayers that
            contains details of their business transactions for a specific
            period. It includes information about outward supplies (sales),
            inward supplies (purchases), input tax credit, and the net tax
            payable to the government. Filing GST returns is mandatory for all
            registered businesses, and it helps the government track tax
            collection, prevent tax evasion, and ensure compliance. Returns can
            be filed monthly, quarterly, or annually depending on the taxpayer
            category.{" "}
          </p>{" "}
          <p>
            {" "}
            There are different types of GST returns such as GSTR-1 for sales
            details, GSTR-3B for summary of sales, purchases, and tax payment,
            and GSTR-9 for annual returns. Failure to file returns on time leads
            to penalties, late fees, and interest on outstanding tax amounts.
            Thus, GST ensures transparency and uniformity in the taxation
            system, while GST returns act as compliance reports that enable
            businesses to settle their tax liabilities correctly.{" "}
          </p>{" "}
          <p>
            {" "}
            Businesses registered under GST must obtain a GST Identification
            Number (GSTIN) and file regular returns. These returns include
            outward supplies, inward supplies, and tax payments. GST has
            different slabs (5%, 12%, 18%, and 28%) depending on the type of
            goods or services, making it easier to categorize taxation in a
            transparent manner.{" "}
          </p>{" "}
        </div>
      )}{" "}
      {showInfo && group === "MCA" && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          {" "}
          <h2 className="text-lg font-semibold text-gray-700">
            {" "}
            MCA Information{" "}
          </h2>{" "}
          <p>
            {" "}
            The Ministry of Corporate Affairs (MCA) portal is the official
            digital platform of the Government of India for managing company and
            corporate-related activities. It plays a central role in regulating
            companies, Limited Liability Partnerships (LLPs), and other entities
            registered under the Companies Act, 2013 and LLP Act, 2008. The
            portal acts as a one-stop solution for business registrations,
            compliance filing, and maintaining transparency in the corporate
            ecosystem. By digitizing these processes, MCA ensures easier access,
            efficiency, and accountability in corporate governance.{" "}
          </p>{" "}
          <p>
            {" "}
            One of the key significances of the MCA portal is that it simplifies
            the process of company incorporation and compliance for
            entrepreneurs and businesses. Earlier, incorporation or filing
            required physical paperwork and long procedures, but now, with
            digital forms and services like SPICe+ (Simplified Proforma for
            Incorporating a Company Electronically Plus), businesses can be
            registered online quickly. This not only reduces red tape but also
            promotes entrepreneurship and ease of doing business in India.{" "}
          </p>{" "}
          <p>
            {" "}
            The portal also ensures regulatory compliance and transparency by
            allowing companies and LLPs to file mandatory documents such as
            annual returns, financial statements, and director-related
            information online. Stakeholders like investors, creditors, and
            regulators can access these filings to check a company’s legal and
            financial standing. Public access to such corporate information
            promotes trust, minimizes fraud, and enhances the credibility of
            registered businesses.{" "}
          </p>{" "}
          <p>
            {" "}
            In terms of features, the MCA portal provides a wide range of
            services, including company incorporation, DIN (Director
            Identification Number) application, LLP registration, charge
            registration, e-filing of forms, compliance monitoring, and
            grievance redressal. It integrates payment gateways for online fee
            payments and provides real-time tracking of application status. With
            its user-friendly interface and continuous updates, the MCA portal
            has become a crucial tool for businesses, professionals, and
            regulators, ensuring smooth corporate governance in India.{" "}
          </p>{" "}
        </div>
      )}{" "}
      {showInfo && group === "IncomeTax" && (
        <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
          {" "}
          <h2 className="text-lg font-semibold text-gray-700">
            {" "}
            ITR Information{" "}
          </h2>{" "}
          <p>
            {" "}
            Income Tax Return (ITR) is a form that taxpayers in India use to
            declare their income, expenses, deductions, and taxes paid to the
            Income Tax Department. Filing ITR is a legal requirement for
            individuals and entities whose income crosses the prescribed
            exemption limit. It helps the government track income, prevent tax
            evasion, and ensure transparency in financial matters. Even people
            with income below the taxable limit may file ITR voluntarily to
            claim refunds or keep a clean financial record.{" "}
          </p>{" "}
          <p>
            {" "}
            There are different types of ITR forms based on income sources and
            taxpayer categories. For example, ITR-1 (Sahaj) is for individuals
            with salary or pension income, ITR-2 is for those with income from
            multiple sources like property or capital gains, ITR-3 for
            professionals or business owners, and ITR-4 (Sugam) for small
            businesses under presumptive taxation. Higher categories like ITR-5,
            ITR-6, and ITR-7 are meant for firms, companies, and charitable
            trusts. Choosing the right form is crucial, as filing with the wrong
            one can lead to rejection.{" "}
          </p>{" "}
          <p>
            {" "}
            The deadlines for ITR filing vary depending on the taxpayer.
            Generally, for individuals and salaried employees, the due date is
            31st July of the assessment year. For companies and taxpayers
            requiring audit, the deadline is usually 31st October, while those
            involved in transfer pricing transactions may get time until 30th
            November. The government sometimes extends these dates depending on
            circumstances, but filing after the deadline attracts late fees,
            interest, and sometimes penalties.{" "}
          </p>{" "}
          <p>
            {" "}
            As for who should file ITR, it applies to individuals, Hindu
            Undivided Families (HUFs), firms, companies, and trusts whose income
            is above the exemption limit. Currently, the basic exemption limit
            is ₹2.5 lakh for individuals below 60 years, ₹3 lakh for senior
            citizens (60–80 years), and ₹5 lakh for super senior citizens (above
            80 years). Apart from income criteria, filing is also mandatory if
            someone wants to claim a refund, carry forward losses, or has
            foreign assets. Thus, ITR filing is not just a duty but also a way
            to stay compliant and financially transparent.{" "}
          </p>{" "}
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center text-blue-600 font-semibold cursor-pointer"
        >
          <span className="text-xl mr-2">+</span> Add new Person details
        </button>
      </div>
      {showForm && <PersonForm onAdd={addPerson} group={group} />}
      <div className="relative w-full max-w-md ml-auto">
        <div className="flex">
          <input
            type="text"
            placeholder="Search by name, PAN, or phone..."
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-gray-300 rounded-l px-4 py-2 w-full"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 cursor-pointer"
          >
            🔍
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded shadow max-h-60 overflow-y-auto">
            {suggestions.map((person, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(person)}
                className={`px-4 py-2 cursor-pointer ${
                  idx === highlightIndex ? "bg-blue-100" : "hover:bg-blue-50"
                }`}
              >
                {person.name} — {person.panNumber} — {person.phoneNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((person, id) => (
            <PersonTable
              key={id}
              person={person}
              people={people}
              setPeople={() => {}}
              onDelete={() => deletePerson(id)}
              group={group}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
