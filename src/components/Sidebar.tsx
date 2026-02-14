import React from "react";
import { CATEGORIES } from "../constants";
import { Category } from "../types";

interface Props {

  activeCategory: Category;

  onCategoryChange: (category: Category) => void;

  onConnectAccount: () => void;

  connected: boolean;

  gmailEmail: string;

}

const Sidebar: React.FC<Props> = ({

  activeCategory,

  onCategoryChange,

  onConnectAccount,

  connected,

  gmailEmail

}) => {

  return (

    <div className="w-64 bg-white border-r h-full flex flex-col">

      <div className="p-4 border-b">

        <h1 className="text-xl font-bold text-blue-600">
          ZenMail
        </h1>

      </div>


      <div className="flex-1 overflow-y-auto">

        {CATEGORIES.map(cat => (

          <button

            key={cat.id}

            onClick={() =>
              onCategoryChange(cat.id)
            }

            className={`w-full text-left px-4 py-2 hover:bg-slate-100 ${
              activeCategory === cat.id
                ? "bg-blue-50 text-blue-600"
                : ""
            }`}

          >

            {cat.label}

          </button>

        ))}

      </div>


      <div className="p-4 border-t">

        {connected ? (

          <div>

            <div className="text-green-600 font-medium">
              Connected ✓
            </div>

            <div className="text-sm text-slate-500">
              {gmailEmail}
            </div>

          </div>

        ) : (

          <button

            onClick={onConnectAccount}

            className="w-full bg-blue-600 text-white px-4 py-2 rounded"

          >

            Connect Gmail

          </button>

        )}

      </div>

    </div>

  );

};

export default Sidebar;



