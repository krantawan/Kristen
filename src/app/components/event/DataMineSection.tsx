"use client";

import { useState, useMemo } from "react";
import { getEventBadge, getEventColor } from "@/lib/event-utils";
import { formatDateRange } from "@/lib/date/formatDateRange";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";

import eventsDatamineRaw from "@/data/events_datamine.json";

const credit = eventsDatamineRaw.credit;
const eventsDatamine = eventsDatamineRaw.events_datamine as {
  title: string;
  start: string;
  end: string;
  type: string;
  image?: string;
  status?: string;
  source: string;
}[];

const typeLabels: Record<string, string> = {
  other: "Other",
  login: "Login Event",
  side: "Side Story",
  integrated: "Integrated Strategies",
  record: "Record Restoration",
  cc: "Contingency Contract",
  main: "Main Story",
};

const typeOrder = [
  "main",
  "side",
  "integrated",
  "cc",
  "record",
  "login",
  "other",
];

export default function DataMineTable() {
  const locale = useLocale();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return eventsDatamine
      .filter((event) => {
        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || event.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aTime = new Date(a.start).getTime();
        const bTime = new Date(b.start).getTime();
        return aTime - bTime;
      });
  }, [searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="bg-[#222] px-2 pt-3 pb-1 text-3xl font-black tracking-tight font-roboto text-white">
        <div className="flex items-center">
          <div className="h-1 w-6 bg-[#BEC93B]" />
          <div className="h-1 w-6 bg-[#F6B347]" />
          <div className="h-1 w-6 bg-[#802520]" />
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h2 className="text-2xl font-black tracking-tight font-roboto">
            Data Mine
          </h2>
          <p className="text-sm text-gray-400 mt-1 sm:mt-0 sm:text-right">
            Data Source: {credit}
          </p>
        </div>
      </div>
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            {/* Search → อยู่แถวบนบน mobile, แถวซ้ายบน PC */}
            <div className="w-full sm:w-auto flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter + Items → อยู่แถวล่าง mobile, แถวขวา PC */}
            <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[73%] sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {typeOrder.map((type) => (
                    <SelectItem key={type} value={type}>
                      {typeLabels[type] || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[25%] sm:w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold">
                    Reference Picture
                  </th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Title</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((event) => (
                  <tr
                    key={event.title + event.start}
                    className="border-b border-gray-100 hover:bg-gray-100 transition-colors dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <td className="p-4">
                      <div className="relative inline-block">
                        {/* DATAMINE Badge */}
                        {event.source === "datamine" && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded z-10">
                            DATAMINE
                          </div>
                        )}

                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          width={500}
                          height={500}
                          draggable={false}
                          className={`rounded-lg object-cover border`}
                        />
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                      {formatDateRange(locale, event.start, event.end)}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={`${getEventColor(event.type)} font-medium`}
                      >
                        {getEventBadge(event)}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-gray-200">
                      {event.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 mt-4">
            {paginatedData.map((event) => (
              <Card key={event.title + event.start} className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={500}
                    height={300}
                    className="rounded-lg object-cover border w-full sm:w-auto"
                    draggable={false}
                  />

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    {/* Title + Badge → บรรทัดแรก */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-gray-900 dark:text-gray-200">
                        {event.title}
                      </div>
                      <Badge
                        variant="outline"
                        className={`${getEventColor(
                          event.type
                        )} font-medium rounded w-fit`}
                      >
                        {getEventBadge(event)}
                      </Badge>
                    </div>

                    {/* Date → บรรทัดล่าง */}
                    <time className="text-sm font-medium text-gray-600 dark:text-gray-200">
                      {!event.end || event.end.trim() === ""
                        ? `${formatDateRange(
                            locale,
                            event.start,
                            event.start
                          )} → TBD`
                        : formatDateRange(locale, event.start, event.end)}
                    </time>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} results
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
