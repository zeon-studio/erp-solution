import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import options from "@/config/options.json";
import EditFrom from "@/partials/EditFrom";
import {
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
} from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import {
  useGetEmployeeBankQuery,
  useUpdateEmployeeBankMutation,
} from "@/redux/features/employeeBankApiSlice/employeeBankSlice";
import { TEmployeeBank } from "@/redux/features/employeeBankApiSlice/employeeBankType";
import {
  useGetEmployeeEducationQuery,
  useUpdateEmployeeEducationMutation,
} from "@/redux/features/employeeEducationApiSlice/employeeEducationSlice";
import { TEmployeeEducation } from "@/redux/features/employeeEducationApiSlice/employeeEducationType";
import { Loader2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { notFound, useParams } from "next/navigation";

export default function PersonalInfo() {
  const { data: session } = useSession();
  const isUser = session?.user.role === "user";
  let { employeeId } = useParams<{ employeeId: string }>();
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetEmployeeQuery(
    employeeId ?? session?.user.id!
  );
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const { data: bankDetails, isLoading: isBankLoading } =
    useGetEmployeeBankQuery(employeeId ?? session?.user.id!);

  const [updateBankInfo, { isLoading: isBankInfoUpdating }] =
    useUpdateEmployeeBankMutation();

  const [updateEducationInfo, { isLoading: isEducationUpdating }] =
    useUpdateEmployeeEducationMutation();

  const { data: educationDetails, isLoading: isEducationLoading } =
    useGetEmployeeEducationQuery(employeeId ?? session?.user.id!);

  if (isLoading || isBankLoading || isEducationLoading) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Loader2 className="animate-spin size-5 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && !data?.result) {
    notFound();
  }

  const handleSubmit = (data: TEmployee) => {
    data.dob = new Date(data.dob);
    updateEmployee(data);
  };

  return (
    <div className="space-y-10">
      <EditFrom<TEmployee>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Personal Details"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-6">
                <Label>Full Name:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.name || ""}
                  name="name"
                  placeholder="Full Name"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Mobile Phone:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.phone || ""}
                  name="phone"
                  placeholder="Phone Number"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Work Email:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="email"
                  value={data.work_email || ""}
                  name="work_email"
                  placeholder="Work Email"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Personal Email:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="email"
                  value={data.personal_email || ""}
                  name="personal_email"
                  placeholder="Personal Email"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Date of Birth:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="date"
                  required
                  // @ts-ignore
                  value={new Date(data.dob).toISOString().split("T")[0]}
                  name="dob"
                  placeholder="Date of Birth"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Gender:</Label>
                {isReadOnly ? (
                  <p className="text-sm text-text-light">
                    {data.gender || "Not Available"}
                  </p>
                ) : (
                  <Select
                    name="gender"
                    value={data.gender}
                    onValueChange={(value) =>
                      handleChange({
                        ...data,
                        gender: value as "male" | "female",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.employee_gender.map((item) => {
                        return (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="lg:col-6">
                <Label>Present Address:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.present_address || ""}
                  name="present_address"
                  placeholder="Present Address"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Permanent Address:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.permanent_address || ""}
                  name="permanent_address"
                  placeholder="Permanent Address"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="lg:col-6">
                <Label>Blood Group:</Label>
                {isReadOnly ? (
                  <p className="text-sm text-text-light">
                    {data.blood_group || "Not Available"}
                  </p>
                ) : (
                  <Select
                    onValueChange={(value) =>
                      handleChange({
                        ...data,
                        blood_group: value as
                          | "A+"
                          | "A-"
                          | "B+"
                          | "B-"
                          | "O+"
                          | "O-"
                          | "AB+"
                          | "AB-",
                      })
                    }
                    name="blood_group"
                    value={data.blood_group}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Blood" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.employee_blood_group.map(
                        (employee_blood_group) => {
                          return (
                            <SelectItem
                              key={employee_blood_group.value}
                              value={employee_blood_group.value}
                            >
                              {employee_blood_group.label}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="lg:col-6">
                <Label>Marital Status:</Label>
                {isReadOnly ? (
                  <p className="text-sm text-text-light">
                    {data.marital_status || "Not Available"}
                  </p>
                ) : (
                  <Select
                    onValueChange={(value) =>
                      handleChange({
                        ...data,
                        marital_status: value as
                          | "married"
                          | "unmarried"
                          | "divorced"
                          | "widowed",
                      })
                    }
                    name="marital_status"
                    value={data.marital_status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.employee_marital_status.map((item) => {
                        return (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="lg:col-6">
                <Label>Tin:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.tin || ""}
                  name="tin"
                  placeholder="Tin"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>NID:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.nid || ""}
                  name="nid"
                  placeholder="NID"
                  readOnly={isReadOnly}
                />
              </div>

              {!isReadOnly && (
                <>
                  <div className="lg:col-6">
                    <Label>Facebook Profile:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      type="url"
                      value={data.facebook || ""}
                      name="facebook"
                      placeholder="Facebook Profile"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="lg:col-6">
                    <Label>Twitter(X) Profile:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      type="url"
                      value={data.twitter || ""}
                      name="twitter"
                      placeholder="X profile"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="lg:col-6">
                    <Label>Linkedin Profile:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      type="url"
                      value={data.linkedin || ""}
                      name="linkedin"
                      placeholder="Linkedin Profile"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="lg:col-6">
                    <Label>Discord Profile:</Label>
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      type="text"
                      value={data.discord || ""}
                      name="discord"
                      placeholder="Discord Profile"
                      readOnly={isReadOnly}
                    />
                  </div>
                </>
              )}

              <div className="lg:col-6">
                <Label>Personality:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.personality || ""}
                  name="personality"
                  placeholder="Personality Type"
                  readOnly={isReadOnly}
                />
              </div>
              {!isUser && (
                <>
                  <div className="lg:col-6">
                    <Label>Status:</Label>
                    {isReadOnly ? (
                      <p className="text-sm text-text-light">
                        {data.status || "Not Available"}
                      </p>
                    ) : (
                      <Select
                        onValueChange={(value) => {
                          handleChange({
                            ...data,
                            status: value as "pending" | "active" | "archived",
                          });
                        }}
                        name="status"
                        value={data.status}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.employee_status.map((item) => {
                            return (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="lg:col-12">
                    <Label>Note:</Label>
                    <Textarea
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          [name]: value,
                        });
                      }}
                      value={data.note || ""}
                      name="note"
                      rows={5}
                      readOnly={isReadOnly}
                    />
                  </div>
                </>
              )}
            </form>
          );
        }}
      </EditFrom>

      <EditFrom<TEmployeeBank>
        isUpdating={isBankInfoUpdating}
        data={bankDetails?.result!}
        title="Bank Details"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBankInfo({
                  employee_id: employeeId,
                  banks: data?.banks,
                });
              }}
              className="space-y-4"
              ref={formRef}
            >
              {data?.banks.length > 0 ? (
                data?.banks?.map((bank, index, banks) => {
                  return (
                    <div
                      key={index}
                      className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
                    >
                      {!isReadOnly && (
                        <div className="lg:col-span-2 absolute right-5 top-3">
                          <Button
                            type="button"
                            size={"xs"}
                            variant="outline"
                            onClick={() => {
                              handleChange({
                                ...data,
                                banks: data.banks.filter(
                                  (bank, i) => i !== index
                                ),
                              });
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                      <div className="row gx-3">
                        <div className="lg:col-6 mb-4">
                          <Label>Account Name:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                banks: banks.map((bank, i) => {
                                  if (index === i) {
                                    return { ...bank, [name]: value };
                                  }
                                  return bank;
                                }),
                              });
                            }}
                            value={bank.bank_ac_name || ""}
                            readOnly={isReadOnly}
                            name="bank_ac_name"
                            placeholder="Bank Account Name"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Bank Name:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                banks: banks.map((bank, i) => {
                                  if (index === i) {
                                    return { ...bank, [name]: value };
                                  }
                                  return bank;
                                }),
                              });
                            }}
                            required
                            readOnly={isReadOnly}
                            value={bank.bank_name || ""}
                            name="bank_name"
                            placeholder="Bank Name"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Bank Account Number:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                banks: banks.map((bank, i) => {
                                  if (index === i) {
                                    return { ...bank, [name]: value };
                                  }
                                  return bank;
                                }),
                              });
                            }}
                            required
                            readOnly={isReadOnly}
                            name="bank_ac_no"
                            value={bank.bank_ac_no || ""}
                            placeholder="Bank Account Number"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Branch:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                banks: banks.map((bank, i) => {
                                  if (index === i) {
                                    return { ...bank, [name]: value };
                                  }
                                  return bank;
                                }),
                              });
                            }}
                            required
                            placeholder="Branch"
                            readOnly={isReadOnly}
                            value={bank.bank_branch || ""}
                            name="bank_branch"
                          />
                        </div>
                      </div>
                      {isReadOnly && banks?.length - 1 !== index && (
                        <Separator className="my-6 lg:col-span-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="py-4">No bank account information available.</p>
              )}
              {!isReadOnly && (
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  type="button"
                  onClick={() => {
                    handleChange({
                      ...data,
                      banks: [
                        ...(data?.banks || []),
                        {
                          bank_ac_no: "",
                          bank_branch: "",
                          bank_ac_name: "",
                          bank_district: "",
                          bank_name: "",
                          bank_routing_no: "",
                        },
                      ],
                    });
                  }}
                  disabled={isReadOnly}
                >
                  Add Bank Account
                </Button>
              )}
            </form>
          );
        }}
      </EditFrom>

      <EditFrom<TEmployeeEducation>
        isUpdating={isEducationUpdating}
        data={educationDetails?.result!}
        title="Educational Details"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateEducationInfo({
                  employee_id: employeeId,
                  educations: data?.educations,
                });
              }}
              className="space-y-4"
              ref={formRef}
            >
              {data?.educations.length > 0 ? (
                data?.educations?.map((education, index, educations) => {
                  return (
                    <div
                      className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
                      key={index}
                    >
                      {!isReadOnly && (
                        <div className="lg:col-span-2 absolute right-5 top-3">
                          <Button
                            type="button"
                            size={"xs"}
                            variant="outline"
                            onClick={() => {
                              handleChange({
                                ...data,
                                educations: data.educations.filter(
                                  (education, i) => i !== index
                                ),
                              });
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                      <div className="row gx-3">
                        <div className="lg:col-6 mb-4">
                          <Label>Degree:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                educations: educations.map((education, i) => {
                                  if (index === i) {
                                    return { ...education, [name]: value };
                                  }
                                  return education;
                                }),
                              });
                            }}
                            required
                            value={education.degree || ""}
                            readOnly={isReadOnly}
                            name="degree"
                            placeholder="Degree"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Name of Institution:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                educations: educations.map((education, i) => {
                                  if (index === i) {
                                    return { ...education, [name]: value };
                                  }
                                  return education;
                                }),
                              });
                            }}
                            required
                            readOnly={isReadOnly}
                            value={education.institute || ""}
                            name="institute"
                            placeholder="Institute name"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Passing Year:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                educations: educations.map((education, i) => {
                                  if (index === i) {
                                    return { ...education, [name]: value };
                                  }
                                  return education;
                                }),
                              });
                            }}
                            type="number"
                            required
                            readOnly={isReadOnly}
                            name="passing_year"
                            value={education.passing_year || ""}
                            placeholder="Passing year"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Major:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                educations: educations.map((education, i) => {
                                  if (index === i) {
                                    return { ...education, [name]: value };
                                  }
                                  return education;
                                }),
                              });
                            }}
                            required
                            readOnly={isReadOnly}
                            value={education.major || ""}
                            name="major"
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Result:</Label>
                          <Input
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                ...data,
                                educations: educations.map((education, i) => {
                                  if (index === i) {
                                    return { ...education, [name]: value };
                                  }
                                  return education;
                                }),
                              });
                            }}
                            type="number"
                            value={education.result || 0}
                            readOnly={isReadOnly}
                            name="result"
                            required
                          />
                        </div>
                        <div className="lg:col-6 mb-4">
                          <Label>Result Type:</Label>
                          {isReadOnly ? (
                            <p className="text-sm text-text-light">
                              {data.educations[index].result_type ||
                                "Not Available"}
                            </p>
                          ) : (
                            <Select
                              onValueChange={(value) => {
                                handleChange({
                                  ...data,
                                  educations: educations.map((education, i) => {
                                    if (index === i) {
                                      return {
                                        ...education,
                                        result_type: value as
                                          | "gpa"
                                          | "cgpa"
                                          | "percentage",
                                      };
                                    }
                                    return education;
                                  }),
                                });
                              }}
                              defaultValue={education.result_type}
                              disabled={isReadOnly}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Result Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {options.education_result_type.map(
                                  ({ label, value }) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      {isReadOnly && educations.length - 1 !== index && (
                        <Separator className="my-6 lg:col-span-2" />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="py-4">No Education information available. </p>
              )}

              {!isReadOnly && (
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => {
                    handleChange({
                      ...data,
                      educations: [
                        ...(data?.educations ?? []),
                        {
                          degree: "",
                          major: "",
                          result: 0,
                          result_type: "gpa",
                          institute: "",
                          passing_year: 0,
                        },
                      ],
                    });
                  }}
                  type="button"
                  disabled={isReadOnly}
                >
                  Add Education
                </Button>
              )}
            </form>
          );
        }}
      </EditFrom>
    </div>
  );
}
