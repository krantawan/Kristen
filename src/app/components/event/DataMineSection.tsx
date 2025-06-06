"use client";

import { useState, useMemo } from "react";
import { getEventBadge, getEventColor } from "@/lib/event-utils";
import { formatDateRange } from "@/lib/date/formatDateRange";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
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
  const t = useTranslations("components.EventPage");

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Spoiler toggle state
  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false);

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
            {t("data_mine.title")}
          </h2>
          <p className="text-sm text-gray-400 mt-1 sm:mt-0 sm:text-right">
            {t("data_mine.source")}: {credit}
          </p>
        </div>
      </div>

      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            {/* Search */}
            <div className="w-full sm:w-auto flex-1">
              <Input
                placeholder={t("data_mine.search_event")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Filter + Items */}
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
                      {typeLabels[type] || getEventBadge({ type })}
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
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Spoiler Toggle */}
        <div className="flex justify-center mb-4 w-full">
          <Button
            variant={isSpoilerRevealed ? "outline" : "default"}
            onClick={() => setIsSpoilerRevealed(!isSpoilerRevealed)}
            className="w-full max-w-xs"
          >
            {isSpoilerRevealed ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {isSpoilerRevealed
              ? t("data_mine.h_spoil")
              : t("data_mine.r_spoil")}
          </Button>
        </div>

        {/* Main Content with Blur */}
        <CardContent>
          <div
            className={`transition-all duration-500 ${
              !isSpoilerRevealed ? "blur-sm" : ""
            }`}
          >
            {/* Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold">
                      {t("data_mine.reference_picture")}
                    </th>
                    <th className="text-left p-4 font-semibold">
                      {t("data_mine.date")}
                    </th>
                    <th className="text-left p-4 font-semibold">
                      {t("data_mine.type")}
                    </th>
                    <th className="text-left p-4 font-semibold">
                      {t("data_mine.title")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-gray-400 text-sm italic"
                      >
                        {t("data_mine.not_found")}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((event) => (
                      <tr
                        key={event.title + event.start}
                        className="border-b border-gray-100 hover:bg-gray-100 transition-colors dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <td className="p-4">
                          <div className="relative inline-block">
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
                            className={`${getEventColor(
                              event.type
                            )} font-medium`}
                          >
                            {typeLabels[event.type] || event.type}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium text-gray-900 dark:text-gray-200">
                          {event.title}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 mt-4">
              {paginatedData.map((event) => (
                <Card key={event.title + event.start} className="p-4">
                  <div className="flex flex-col xl:flex-row gap-4">
                    {/* Image + Badge Overlay */}
                    <div className="relative w-full xl:w-auto">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        width={500}
                        height={300}
                        className="rounded-lg object-cover border w-full"
                        draggable={false}
                      />

                      {event.source === "datamine" && (
                        <Badge
                          variant="default"
                          className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded z-10"
                        >
                          DATAMINE
                        </Badge>
                      )}

                      <Badge
                        className={`absolute top-2 right-2 ${getEventColor(
                          event.type
                        )} font-medium rounded w-fit`}
                      >
                        {typeLabels[event.type] || event.type}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2 pt-2 xl:pt-0">
                      <div className="font-medium text-gray-900 dark:text-gray-200">
                        {event.title}
                      </div>
                      <time className="text-sm font-medium text-gray-600 dark:text-gray-200">
                        {!event.end || event.end.trim() === ""
                          ? `${formatDateRange(
                              locale,
                              event.start,
                              event.start
                            )} → ${t("data_mine.TBD")}`
                          : formatDateRange(locale, event.start, event.end)}
                      </time>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4 border-gray-200">
            <div className="text-sm text-gray-600">
              {t("data_mine.showing_results", {
                x: startIndex + 1,
                y: Math.min(startIndex + itemsPerPage, filteredData.length),
                z: filteredData.length,
              })}
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
                {t("data_mine.pagination.previous")}
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
                {t("data_mine.pagination.next")}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
